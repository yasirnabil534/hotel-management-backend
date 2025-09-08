import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, Order, UpdateOrderDto } from './order.dto';
import { IOrderRepository } from './order.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { orderProducts, ...orderData } = createOrderDto;

      return this.prisma.$transaction(async (prisma) => {
        // Create the order first
        const order = await prisma.order.create({
          data: orderData as any,
        });

        // Create all order products with the new orderId
        await prisma.orderProduct.createMany({
          data: orderProducts.map(product => ({
            ...product,
            orderId: order.id
          })),
        });

        // Return the order with its products
        return prisma.order.findUnique({
          where: { id: order.id },
          // include: {
          //   user: true,
          //   hotel: true,
          //   OrderProduct: true,
          // },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Order[]> {
    try {
      const { page, limit, sortBy, sortOrder, search, hidden, hotelId, customerId, ...filters } = query || {};
      const skip = page ? (parseInt(page) - 1) * parseInt(limit || '10') : 0;
      const take = limit ? parseInt(limit) : 10;

      let orderBy = undefined;
      if (sortBy) {
        orderBy = {
          [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        };
      }

      let allFilters = { ...filters };
      
      // Add hidden filter - default to false unless explicitly set
      if (hidden !== undefined) {
        allFilters.hidden = hidden === 'true' || hidden === true;
      } else {
        allFilters.hidden = false; // Default to showing only non-hidden orders
      }

      // Add hotel filter if provided
      if (hotelId) {
        allFilters.hotelId = hotelId;
      }

      // Add customer filter if provided (customerId maps to userId in the database)
      if (customerId) {
        allFilters.userId = customerId;
      }
      
      if (search) {
        allFilters = {
          ...allFilters,
          OR: [
            { status: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } },
          ],
        };
      }

      return this.prisma.order.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
        // include: {
        //   user: true,
        //   hotel: true,
        //   OrderProduct: true,
        // },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Order | null> {
    try {
      return this.prisma.order.findFirst({
        where: { 
          id,
          hidden: false
        },
        // include: {
        //   user: true,
        //   hotel: true,
        //   OrderProduct: true,
        // },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Order[]> {
    try {
      return this.prisma.order.findMany({
        where: { 
          userId,
          hidden: false
        },
        // include: {
        //   user: true,
        //   hotel: true,
        //   OrderProduct: true,
        // },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<Order[]> {
    try {
      return this.prisma.order.findMany({
        where: { 
          hotelId,
          hidden: false
        },
        // include: {
        //   user: true,
        //   hotel: true,
        //   OrderProduct: true,
        // },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByHotelAndUser(hotelId: string, userId: string): Promise<Order[]> {
    try {
      return this.prisma.order.findMany({
        where: { 
          hotelId,
          userId,
          hidden: false
        },
        // include: {
        //   user: true,
        //   hotel: true,
        //   OrderProduct: true,
        // },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      return this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
        // include: {
        //   user: true,
        //   hotel: true,
        //   OrderProduct: true,
        // },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
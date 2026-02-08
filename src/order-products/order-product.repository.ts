import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderProduct, IOrderProductRepository } from './order-product.interface';
import { CreateOrderProductDto, UpdateOrderProductDto } from './order-product.dto';

@Injectable()
export class OrderProductRepository implements IOrderProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderProductDto): Promise<OrderProduct> {
    try {
      return this.prisma.orderProduct.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<OrderProduct[]> {
    try {
      const { page, limit, sortBy, sortOrder, hotelId, orderId, productId, ...filters } = query || {};
      const skip = page ? (parseInt(page) - 1) * parseInt(limit || '10') : 0;
      const take = limit ? parseInt(limit) : 10;

      let orderBy = undefined;
      if (sortBy) {
        orderBy = {
          [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        };
      }

      const whereClause: any = { ...filters };

      // Filter by orderId
      if (orderId) {
        whereClause.orderId = orderId;
      }

      // Filter by productId
      if (productId) {
        whereClause.productId = productId;
      }

      // Filter by hotelId (through order relation)
      if (hotelId) {
        whereClause.order = {
          hotelId: hotelId,
        };
      }

      return this.prisma.orderProduct.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
        include: {
          order: true,
          product: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<OrderProduct | null> {
    try {
      return this.prisma.orderProduct.findUnique({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: UpdateOrderProductDto): Promise<OrderProduct> {
    try {
      return this.prisma.orderProduct.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<OrderProduct> {
    try {
      return this.prisma.orderProduct.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByOrder(orderId: string): Promise<OrderProduct[]> {
    try {
      return this.prisma.orderProduct.findMany({
        where: { orderId },
      });
    } catch (error) {
      throw error;
    }
  }
}
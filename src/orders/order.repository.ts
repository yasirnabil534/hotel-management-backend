import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, Order, UpdateOrderDto } from './order.dto';
import { IOrderRepository } from './order.interface';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { orderProducts, ...orderData } = createOrderDto;

      return this.prisma.$transaction(async prisma => {
        const productIds = [...new Set(orderProducts.map(product => product.productId))];
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          select: {
            id: true,
          },
        });

        const foundProductIds = new Set(products.map(product => product.id));
        const missingProductIds = productIds.filter(productId => !foundProductIds.has(productId));

        if (missingProductIds.length > 0) {
          throw new BadRequestException(`Invalid productId(s): ${missingProductIds.join(', ')}`);
        }

        // Create the order first
        const order = await prisma.order.create({
          data: orderData as any,
        });

        // Create all order products with the new orderId
        await prisma.orderProduct.createMany({
          data: orderProducts.map(product => ({
            ...product,
            orderId: order.id,
          })),
        });

        // Return the order with its products
        return prisma.order.findUnique({
          where: { id: order.id },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                type: true,
                hotelId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            hotel: true,
            room: {
              select: {
                id: true,
                roomCode: true,
                name: true,
                category: true,
                status: true,
                hotelId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            OrderProduct: {
              include: {
                product: true,
              },
            },
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Order[]> {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        hidden,
        hotelId,
        customerId,
        roomId,
        ...filters
      } = query || {};
      const skip = page ? (parseInt(page) - 1) * parseInt(limit || '10') : 0;
      const take = limit ? parseInt(limit) : 10;

      let orderBy = undefined;
      if (sortBy) {
        orderBy = {
          [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        };
      }

      let allFilters: any = { ...filters };

      // Add hidden filter - default to false unless explicitly set
      if (hidden !== undefined) {
        allFilters.hidden = hidden === 'true' || hidden === true;
      } else {
        allFilters.hidden = false; // Default to showing only non-hidden orders
      }

      // Handle advanced status filters
      if (allFilters.status) {
        if (allFilters.status === 'active') {
          // Active means not done and not cancelled
          allFilters.status = {
            in: [OrderStatus.PENDING, OrderStatus.RECEIVED, OrderStatus.IN_PROGRESS],
          };
        } else if (allFilters.status === 'canceled_by_admin') {
          allFilters.status = OrderStatus.CANCELLED;
          allFilters.cancelledBy = 'admin';
        } else if (allFilters.status === 'canceled_by_customer') {
          allFilters.status = OrderStatus.CANCELLED;
          allFilters.cancelledBy = 'customer';
        }
      }

      // Add hotel filter if provided
      if (hotelId) {
        allFilters.hotelId = hotelId;
      }

      // Add customer filter if provided (customerId maps to userId in the database)
      if (customerId) {
        allFilters.userId = customerId;
      }

      if (roomId) {
        allFilters.roomId = roomId;
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
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              type: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          hotel: true,
          room: {
            select: {
              id: true,
              roomCode: true,
              name: true,
              category: true,
              status: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          OrderProduct: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
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
          hidden: false,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              type: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          hotel: true,
          room: {
            select: {
              id: true,
              roomCode: true,
              name: true,
              category: true,
              status: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          OrderProduct: {
            include: {
              product: {
                select: {
                  name: true,
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
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
          hidden: false,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              type: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          hotel: true,
          room: {
            select: {
              id: true,
              roomCode: true,
              name: true,
              category: true,
              status: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          OrderProduct: {
            include: {
              product: {
                select: {
                  name: true,
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByRoom(roomId: string): Promise<Order[]> {
    try {
      return this.prisma.order.findMany({
        where: {
          roomId,
          hidden: false,
        },
        include: this.orderInclude,
        orderBy: {
          createdAt: 'desc',
        },
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
          hidden: false,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              type: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          hotel: true,
          room: {
            select: {
              id: true,
              roomCode: true,
              name: true,
              category: true,
              status: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          OrderProduct: {
            include: {
              product: {
                select: {
                  name: true,
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
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
          hidden: false,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              type: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          hotel: true,
          room: {
            select: {
              id: true,
              roomCode: true,
              name: true,
              category: true,
              status: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          OrderProduct: {
            include: {
              product: {
                select: {
                  name: true,
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
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
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              type: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          hotel: true,
          room: {
            select: {
              id: true,
              roomCode: true,
              name: true,
              category: true,
              status: true,
              hotelId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          OrderProduct: {
            include: {
              product: {
                select: {
                  name: true,
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      return this.prisma.order.update({
        where: { id },
        data: { status },
        include: this.orderInclude,
      });
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(id: string, cancelledBy: string): Promise<Order> {
    try {
      return this.prisma.order.update({
        where: { id },
        data: { 
          status: OrderStatus.CANCELLED,
          cancelledBy 
        },
        include: this.orderInclude,
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

  private get orderInclude() {
    return {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          type: true,
          hotelId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      hotel: true,
      room: {
        select: {
          id: true,
          roomCode: true,
          name: true,
          category: true,
          status: true,
          hotelId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      OrderProduct: {
        include: {
          product: {
            select: {
              name: true,
              id: true,
              price: true,
            },
          },
        },
      },
    };
  }
}

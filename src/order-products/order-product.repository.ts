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

  async findAll(): Promise<OrderProduct[]> {
    try {
      return this.prisma.orderProduct.findMany();
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
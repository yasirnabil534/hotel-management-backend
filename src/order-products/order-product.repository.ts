import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderProduct, IOrderProductRepository } from './order-product.interface';
import { CreateOrderProductDto, UpdateOrderProductDto } from './order-product.dto';

@Injectable()
export class OrderProductRepository implements IOrderProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderProductDto): Promise<OrderProduct> {
    return this.prisma.orderProduct.create({
      data,
    });
  }

  async findAll(): Promise<OrderProduct[]> {
    return this.prisma.orderProduct.findMany();
  }

  async findOne(id: string): Promise<OrderProduct | null> {
    return this.prisma.orderProduct.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateOrderProductDto): Promise<OrderProduct> {
    return this.prisma.orderProduct.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<OrderProduct> {
    return this.prisma.orderProduct.delete({
      where: { id },
    });
  }

  async findByOrder(orderId: string): Promise<OrderProduct[]> {
    return this.prisma.orderProduct.findMany({
      where: { orderId },
    });
  }
}
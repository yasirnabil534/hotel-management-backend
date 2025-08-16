import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { IOrderRepository, IOrderService } from './order.interface';
import { Order } from './order.dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { orderProducts, ...orderData } = createOrderDto;
      
      // Calculate initial total from order products
      const total = orderProducts.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
      }, 0);

      return this.orderRepository.create({
        ...orderData,
        total,
        orderProducts,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Order[]> {
    try {
      return this.orderRepository.findAll(query || {});
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne(id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Order[]> {
    try {
      return this.orderRepository.findByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<Order[]> {
    try {
      return this.orderRepository.findByHotel(hotelId);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      return await this.orderRepository.update(id, updateOrderDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.orderRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
    }
  }
}
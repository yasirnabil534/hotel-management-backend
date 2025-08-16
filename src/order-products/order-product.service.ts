import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderProductDto, UpdateOrderProductDto } from './order-product.dto';
import { OrderProduct, IOrderProductRepository, IOrderProductService } from './order-product.interface';
import { IOrderService } from '../orders/order.interface';

@Injectable()
export class OrderProductService implements IOrderProductService {
  constructor(
    @Inject('IOrderProductRepository')
    private readonly orderProductRepository: IOrderProductRepository,
    @Inject('IOrderService')
    private readonly orderService: IOrderService
  ) {}

  async create(createOrderProductDto: CreateOrderProductDto): Promise<OrderProduct> {
    try {
      const orderProduct = await this.orderProductRepository.create(createOrderProductDto);
      await this.updateOrderTotal(orderProduct.orderId);
      return orderProduct;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<OrderProduct[]> {
    try {
      return this.orderProductRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async findByOrder(orderId: string): Promise<OrderProduct[]> {
    try {
      return this.orderProductRepository.findByOrder(orderId);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<OrderProduct> {
    try {
      const orderProduct = await this.orderProductRepository.findOne(id);
      if (!orderProduct) {
        throw new NotFoundException(`Order Product with ID ${id} not found`);
      }
      return orderProduct;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateOrderProductDto: UpdateOrderProductDto): Promise<OrderProduct> {
    try {
      const orderProduct = await this.findOne(id);
      const updated = await this.orderProductRepository.update(id, updateOrderProductDto);
      await this.updateOrderTotal(orderProduct.orderId);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<OrderProduct> {
    try {
      const orderProduct = await this.findOne(id);
      const deleted = await this.orderProductRepository.remove(id);
      await this.updateOrderTotal(orderProduct.orderId);
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  private async updateOrderTotal(orderId: string): Promise<void> {
    try {
      await this.orderService.update(orderId, { total: await this.calculateOrderTotal(orderId) });
    } catch (error) {
      throw error;
    }
  }

  private async calculateOrderTotal(orderId: string): Promise<number> {
    try {
      const orderProducts = await this.findByOrder(orderId);
      return orderProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
    } catch (error) {
      throw error;
    }
  }
}
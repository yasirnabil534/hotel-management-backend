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
    const orderProduct = await this.orderProductRepository.create(createOrderProductDto);
    await this.updateOrderTotal(orderProduct.orderId);
    return orderProduct;
  }

  async findAll(): Promise<OrderProduct[]> {
    return this.orderProductRepository.findAll();
  }

  async findByOrder(orderId: string): Promise<OrderProduct[]> {
    return this.orderProductRepository.findByOrder(orderId);
  }

  async findOne(id: string): Promise<OrderProduct> {
    const orderProduct = await this.orderProductRepository.findOne(id);
    if (!orderProduct) {
      throw new NotFoundException(`Order Product with ID ${id} not found`);
    }
    return orderProduct;
  }

  async update(id: string, updateOrderProductDto: UpdateOrderProductDto): Promise<OrderProduct> {
    const orderProduct = await this.findOne(id);
    const updated = await this.orderProductRepository.update(id, updateOrderProductDto);
    await this.updateOrderTotal(orderProduct.orderId);
    return updated;
  }

  async remove(id: string): Promise<OrderProduct> {
    const orderProduct = await this.findOne(id);
    const deleted = await this.orderProductRepository.remove(id);
    await this.updateOrderTotal(orderProduct.orderId);
    return deleted;
  }

  private async updateOrderTotal(orderId: string): Promise<void> {
    await this.orderService.update(orderId, { total: await this.calculateOrderTotal(orderId) });
  }

  private async calculateOrderTotal(orderId: string): Promise<number> {
    const orderProducts = await this.findByOrder(orderId);
    return orderProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  }
}
import { CreateOrderProductDto, UpdateOrderProductDto } from './order-product.dto';

export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderProductRepository {
  create(createOrderProductDto: CreateOrderProductDto): Promise<OrderProduct>;
  findAll(): Promise<OrderProduct[]>;
  findOne(id: string): Promise<OrderProduct | null>;
  update(id: string, updateOrderProductDto: UpdateOrderProductDto): Promise<OrderProduct>;
  remove(id: string): Promise<OrderProduct>;
  findByOrder(orderId: string): Promise<OrderProduct[]>
}

export interface IOrderProductService {
  create(createOrderProductDto: CreateOrderProductDto): Promise<OrderProduct>;
  findAll(): Promise<OrderProduct[]>;
  findOne(id: string): Promise<OrderProduct>;
  update(id: string, updateOrderProductDto: UpdateOrderProductDto): Promise<OrderProduct>;
  remove(id: string): Promise<OrderProduct>;
}
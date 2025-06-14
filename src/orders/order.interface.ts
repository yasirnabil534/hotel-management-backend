import { CreateOrderDto, UpdateOrderDto, Order } from './order.dto';

export interface IOrderRepository {
  create(createOrderDto: CreateOrderDto): Promise<Order>;
  findAll(query?: Record<string, any>): Promise<Order[]>;
  findOne(id: string): Promise<Order | null>;
  findByUser(userId: string): Promise<Order[]>;
  findByHotel(hotelId: string): Promise<Order[]>;
  update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
  remove(id: string): Promise<void>;
}

export interface IOrderService {
  create(createOrderDto: CreateOrderDto): Promise<Order>;
  findAll(query?: Record<string, any>): Promise<Order[]>;
  findOne(id: string): Promise<Order>;
  findByUser(userId: string): Promise<Order[]>;
  findByHotel(hotelId: string): Promise<Order[]>;
  update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
  remove(id: string): Promise<void>;
}

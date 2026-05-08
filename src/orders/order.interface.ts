import { CreateOrderDto, Order, UpdateOrderDto } from './order.dto';
import { OrderStatus } from './order-status.enum';

export interface IOrderRepository {
  create(createOrderDto: CreateOrderDto): Promise<Order>;
  findAll(query?: Record<string, any>): Promise<Order[]>;
  findOne(id: string): Promise<Order | null>;
  findByUser(userId: string): Promise<Order[]>;
  findByRoom(roomId: string): Promise<Order[]>;
  findByHotel(hotelId: string): Promise<Order[]>;
  findByHotelAndUser(hotelId: string, userId: string): Promise<Order[]>;
  update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  remove(id: string): Promise<void>;
}

export interface IOrderService {
  create(createOrderDto: CreateOrderDto): Promise<Order>;
  findAll(query?: Record<string, any>): Promise<Order[]>;
  findOne(id: string): Promise<Order>;
  findByUser(userId: string): Promise<Order[]>;
  findByRoom(roomId: string): Promise<Order[]>;
  findByHotel(hotelId: string): Promise<Order[]>;
  findByHotelAndUser(hotelId: string, userId: string): Promise<Order[]>;
  update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  remove(id: string): Promise<void>;
}

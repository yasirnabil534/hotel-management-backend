import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, Order, UpdateOrderDto } from './order.dto';
import { OrderGateway } from './order.gateway';
import { IOrderRepository, IOrderService } from './order.interface';
import {
  ALL_ORDER_STATUSES,
  CANCELLABLE_STATUSES,
  normalizeOrderStatus,
  OrderStatus,
} from './order-status.enum';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly orderGateway: OrderGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { orderProducts, ...orderData } = createOrderDto;
      const status = this.resolveStatus(orderData.status);

      // Calculate initial total from order products
      const total = orderProducts.reduce((sum, product) => {
        return sum + product.price * product.quantity;
      }, 0);

      const order = await this.orderRepository.create({
        ...orderData,
        status,
        total,
        orderProducts,
      });

      this.orderGateway.emitOrderCreated(order);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Order[]> {
    try {
      const processedQuery = { ...(query || {}) };

      // We do NOT use this.resolveStatus() here because the query filter
      // supports advanced statuses like 'active', 'canceled_by_admin', etc.,
      // which the repository handles internally.
      
      return this.orderRepository.findAll(processedQuery);
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

  async findByRoom(roomId: string): Promise<Order[]> {
    try {
      return this.orderRepository.findByRoom(roomId);
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

  async findByHotelAndUser(hotelId: string, userId: string): Promise<Order[]> {
    try {
      return this.orderRepository.findByHotelAndUser(hotelId, userId);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const nextOrderData = {
        ...updateOrderDto,
        status: updateOrderDto.status
          ? this.resolveStatus(updateOrderDto.status)
          : undefined,
      };

      return await this.orderRepository.update(id, nextOrderData);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      if (!status) {
        throw new BadRequestException('Order status is required');
      }

      const order = await this.orderRepository.updateStatus(
        id,
        this.resolveStatus(status),
      );

      this.orderGateway.emitOrderStatusUpdate(order);
      return order;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
    }
  }

  async cancelOrder(id: string, cancelledBy: string): Promise<Order> {
    try {
      const existingOrder = await this.orderRepository.findOne(id);
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (!CANCELLABLE_STATUSES.includes(existingOrder.status as OrderStatus)) {
        throw new BadRequestException(
          `Order cannot be cancelled. Only orders with status ${CANCELLABLE_STATUSES.join(', ')} can be cancelled.`,
        );
      }

      const cancelledOrder = await this.orderRepository.cancelOrder(
        id,
        cancelledBy,
      );

      this.orderGateway.emitOrderCancelled(cancelledOrder);
      return cancelledOrder;
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

  private resolveStatus(status?: string): OrderStatus {
    if (!status) {
      return OrderStatus.PENDING;
    }

    const normalizedStatus = normalizeOrderStatus(status);
    if (!normalizedStatus) {
      throw new BadRequestException(
        `Invalid order status. Allowed statuses: ${ALL_ORDER_STATUSES.join(', ')}`,
      );
    }

    return normalizedStatus;
  }
}


import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Order } from './order.dto';

@WebSocketGateway({ namespace: '/orders', cors: { origin: true } })
export class OrderGateway {
  private readonly logger = new Logger(OrderGateway.name);

  @WebSocketServer()
  server: Server;

  /**
   * Clients call this to subscribe to a specific hotel's order events.
   * Usage: socket.emit('join-hotel', { hotelId: '...' })
   */
  @SubscribeMessage('join-hotel')
  handleJoinHotel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { hotelId: string },
  ): void {
    const room = `hotel:${payload.hotelId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined ${room}`);
  }

  /**
   * Clients call this to unsubscribe from a hotel's order events.
   * Usage: socket.emit('leave-hotel', { hotelId: '...' })
   */
  @SubscribeMessage('leave-hotel')
  handleLeaveHotel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { hotelId: string },
  ): void {
    const room = `hotel:${payload.hotelId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left ${room}`);
  }

  // ── Methods called by OrderService ────────────────────────────────────

  /** Broadcast when a new order is created. */
  emitOrderCreated(order: Order): void {
    const room = `hotel:${order.hotelId}`;
    this.server.to(room).emit('order:created', order);
    this.logger.log(`Emitted order:created for order ${order.id} to ${room}`);
  }

  /** Broadcast when admin advances order status. */
  emitOrderStatusUpdate(order: Order): void {
    const room = `hotel:${order.hotelId}`;
    this.server.to(room).emit('order:status-updated', order);
    this.logger.log(
      `Emitted order:status-updated for order ${order.id} to ${room}`,
    );
  }

  /** Broadcast when an order is cancelled. */
  emitOrderCancelled(order: Order): void {
    const room = `hotel:${order.hotelId}`;
    this.server.to(room).emit('order:cancelled', order);
    this.logger.log(
      `Emitted order:cancelled for order ${order.id} to ${room}`,
    );
  }
}

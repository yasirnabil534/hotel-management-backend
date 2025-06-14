import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [
    {
      provide: 'IOrderService',
      useClass: OrderService,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
  exports: ['IOrderService', 'IOrderRepository'],
})
export class OrderModule {}
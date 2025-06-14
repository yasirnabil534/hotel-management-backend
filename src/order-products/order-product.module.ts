import { Module } from '@nestjs/common';
import { OrderProductController } from './order-product.controller';
import { OrderProductService } from './order-product.service';
import { OrderProductRepository } from './order-product.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [PrismaModule,  OrderModule],
  controllers: [OrderProductController],
  providers: [
    {
      provide: 'IOrderProductService',
      useClass: OrderProductService,
    },
    {
      provide: 'IOrderProductRepository',
      useClass: OrderProductRepository,
    },
  ],
  exports: ['IOrderProductService', 'IOrderProductRepository'],
})
export class OrderProductModule {}
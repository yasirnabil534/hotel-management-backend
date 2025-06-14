import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [PrismaModule, OrderModule],
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartService',
      useClass: CartService,
    },
    {
      provide: 'ICartRepository',
      useClass: CartRepository,
    },
  ],
  exports: ['ICartService', 'ICartRepository'],
})
export class CartModule {}
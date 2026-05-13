import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './carts/cart.module';
import { CategoryModule } from './categories/category.module';
import { DynamicServicesModule } from './dynamic-services/dynamic-services.module';
import { HotelDetailsModule } from './hotel-details/hotel-details.module';
import { HotelModule } from './hotels/hotel.module';
import { MealPlanModule } from './meal-plans/meal-plan.module';
import { OrderProductModule } from './order-products/order-product.module';
import { OrderModule } from './orders/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './products/product.module';
import { RoomBookingModule } from './room-bookings/room-booking.module';
import { RoomSessionModule } from './room-sessions/room-session.module';
import { RoomModule } from './rooms/room.module';
import { ServiceTemplateModule } from './service-templates/service-template.module';
import { ServicesModule } from './services/service.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RoomModule,
    RoomSessionModule,
    RoomBookingModule,
    HotelModule,
    HotelDetailsModule,
    ServicesModule,
    ProductModule,
    PrismaModule,
    CategoryModule,
    DynamicServicesModule,
    ServiceTemplateModule,
    OrderModule,
    OrderProductModule,
    CartModule,
    MealPlanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

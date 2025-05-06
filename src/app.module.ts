import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotels/hotel.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './products/product.module';
import { ServicesModule } from './services/service.module';
import { UsersModule } from './users/user.module';
import { CategoryModule } from './categories/category.module';
import { DynamicServicesModule } from './dynamic-services/dynamic-services.module';
import { ServiceTemplateModule } from './service-templates/service-template.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    HotelModule,
    ServicesModule,
    ProductModule,
    PrismaModule,
    CategoryModule,
    DynamicServicesModule,
    ServiceTemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

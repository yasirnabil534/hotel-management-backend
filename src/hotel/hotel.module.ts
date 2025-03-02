import { Module } from '@nestjs/common';
import { HotelRepository } from './hotel.repository';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HotelController],
  providers: [
    HotelService,
    {
      provide: 'IHotelRepository',
      useClass: HotelRepository,
    },
    {
      provide: 'IHotelService',
      useClass: HotelService,
    }
  ],
})
export class HotelModule {}
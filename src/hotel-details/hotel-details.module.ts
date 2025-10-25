import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HotelDetailsController } from './hotel-details.controller';
import { HotelDetailsRepository } from './hotel-details.repository';
import { HotelDetailsService } from './hotel-details.service';

@Module({
  imports: [PrismaModule],
  controllers: [HotelDetailsController],
  providers: [
    {
      provide: 'IHotelDetailsRepository',
      useClass: HotelDetailsRepository,
    },
    {
      provide: 'IHotelDetailsService',
      useClass: HotelDetailsService,
    },
  ],
})
export class HotelDetailsModule {}


import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomModule } from '../rooms/room.module';
import { RoomBookingController } from './room-booking.controller';
import { RoomBookingRepository } from './room-booking.repository';
import { RoomBookingService } from './room-booking.service';

@Module({
  imports: [PrismaModule, RoomModule],
  controllers: [RoomBookingController],
  providers: [
    RoomBookingService,
    RoomBookingRepository,
    {
      provide: 'IRoomBookingService',
      useClass: RoomBookingService,
    },
    {
      provide: 'IRoomBookingRepository',
      useClass: RoomBookingRepository,
    },
  ],
  exports: ['IRoomBookingService', 'IRoomBookingRepository'],
})
export class RoomBookingModule {}

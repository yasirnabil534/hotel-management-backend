import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomSessionModule } from '../room-sessions/room-session.module';
import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomsService } from './room.service';

@Module({
  imports: [PrismaModule, forwardRef(() => RoomSessionModule)],
  controllers: [RoomController],
  providers: [
    RoomsService,
    RoomRepository,
    {
      provide: 'IRoomService',
      useClass: RoomsService,
    },
    {
      provide: 'IRoomRepository',
      useClass: RoomRepository,
    },
  ],
  exports: ['IRoomService', 'IRoomRepository'],
})
export class RoomModule {}

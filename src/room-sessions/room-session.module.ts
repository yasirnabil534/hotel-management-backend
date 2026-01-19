import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomModule } from '../rooms/room.module';
import { RoomSessionController } from './room-session.controller';
import { RoomSessionRepository } from './room-session.repository';
import { RoomSessionService } from './room-session.service';

@Module({
  imports: [PrismaModule, forwardRef(() => RoomModule)],
  controllers: [RoomSessionController],
  providers: [
    RoomSessionService,
    RoomSessionRepository,
    {
      provide: 'IRoomSessionService',
      useClass: RoomSessionService,
    },
    {
      provide: 'IRoomSessionRepository',
      useClass: RoomSessionRepository,
    },
  ],
  exports: ['IRoomSessionService', 'IRoomSessionRepository'],
})
export class RoomSessionModule {}

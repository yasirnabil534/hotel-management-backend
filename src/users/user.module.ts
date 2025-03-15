import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';
import { UsersService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserService',
      useClass: UsersService,
    },
    {
      // provide: USER_REPOSITORY,
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}

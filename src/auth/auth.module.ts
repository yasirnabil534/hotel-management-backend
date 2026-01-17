import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/users/user.repository';
import { UsersService } from 'src/users/user.service';
import { RoomSessionModule } from '../room-sessions/room-session.module';
import { RoomModule } from '../rooms/room.module';
import { UsersModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RoomStrategy } from './room.strategy';

@Module({
  imports: [
    UsersModule,
    RoomModule,
    RoomSessionModule,
    ConfigModule.forRoot(),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IUserService',
      useClass: UsersService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    JwtStrategy,
    LocalStrategy,
    RoomStrategy,
  ],
  exports: ['IAuthService', 'IUserService', 'IUserRepository'],
})
export class AuthModule {}

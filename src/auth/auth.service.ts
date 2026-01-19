import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Room, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { IRoomService } from '../rooms/room.interface';
import { IUserService } from '../users/user.interface';
import { IAuthService } from './auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserService')
    private readonly usersService: IUserService,
    @Inject('IRoomService')
    private readonly roomsService: IRoomService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async validateRoomForLogin(roomCode: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }> {
    return await this.roomsService.validateRoomForLogin(roomCode);
  }

  async validateRoomWithToken(token: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }> {
    return await this.roomsService.validateRoomWithToken(token);
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, type: 'human' };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '3650d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '3650d' }),
      user: user,
    };
  }

  async loginRoom(room: Omit<Room, 'password'>) {
    const payload = { roomCode: room.roomCode, sub: room.id, type: 'room' };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '3650d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '3650d' }),
      room: room,
    };
  }
}

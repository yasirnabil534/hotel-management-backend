import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IAuthService } from './auth.interface';

@Injectable()
export class RoomStrategy extends PassportStrategy(Strategy, 'room') {
  constructor(
    @Inject('IAuthService')
    private authService: IAuthService,
  ) {
    super({
      usernameField: 'roomCode',
      passwordField: 'roomCode', // Use roomCode for both fields since we only need one
    });
  }

  async validate(roomCode: string): Promise<any> {
    const room = await this.authService.validateRoomForLogin(roomCode);
    if (!room) {
      throw new UnauthorizedException('Invalid room code or room not accepted');
    }
    return room;
  }
}

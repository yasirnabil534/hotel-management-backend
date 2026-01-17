import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Handle both human and room types
    if (payload.type === 'room') {
      return { 
        userId: payload.sub, 
        roomCode: payload.roomCode, 
        type: 'room' 
      };
    }
    
    // Default to human type
    return { 
      userId: payload.sub, 
      email: payload.email, 
      type: 'human' 
    };
  }
}

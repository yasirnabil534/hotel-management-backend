import { Room, User } from '@prisma/client';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<Omit<User, 'password'>>;
  validateRoomForLogin(roomCode: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }>;
  validateRoomWithToken(token: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }>;
  login(user: Omit<User, 'password'>): Promise<{
    access_token: string;
    refresh_token: string;
    user: Omit<User, 'password'>;
  }>;
  loginRoom(room: Omit<Room, 'password'>): Promise<{
    access_token: string;
    refresh_token: string;
    room: Omit<Room, 'password'>;
  }>;
}

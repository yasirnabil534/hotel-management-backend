import { User } from '@prisma/client';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<Omit<User, 'password'>>;
  login(user: Omit<User, 'password'>): Promise<{
    access_token: string;
    refresh_token: string;
    user: Omit<User, 'password'>;
  }>;
}

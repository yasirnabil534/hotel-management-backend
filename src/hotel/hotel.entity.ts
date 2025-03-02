import { Hotel as PrismaHotel } from '@prisma/client';
import { User } from '../users/user.entity';

export class Hotel implements PrismaHotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
}

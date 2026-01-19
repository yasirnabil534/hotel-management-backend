import { Room } from '@prisma/client';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';

export interface IRoomRepository {
  create(createRoomDto: CreateRoomDto): Promise<Room>;
  findAll(query: Record<string, any>): Promise<Room[]>;
  findOne(id: string): Promise<Room | null>;
  findByRoomCode(roomCode: string): Promise<Room | null>;
  update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room>;
  remove(id: string): Promise<void>;
}

export interface IRoomService {
  create(createRoomDto: CreateRoomDto): Promise<Room>;
  findAll(query?: Record<string, any>): Promise<Room[]>;
  findOne(id: string): Promise<Room | null>;
  findByRoomCode(roomCode: string): Promise<Room | null>;
  update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room>;
  remove(id: string): Promise<void>;
  validateRoomForLogin(roomCode: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }>;
  generateRoomQRCode(roomId: string, password: string): Promise<{ token: string; qrCode: string }>;
  validateRoomWithToken(token: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }>;
}

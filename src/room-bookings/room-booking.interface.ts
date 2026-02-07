import { RoomBooking } from '@prisma/client';
import { CreateRoomBookingDto, UpdateRoomBookingDto } from './room-booking.dto';

export interface IRoomBookingRepository {
  create(createRoomBookingDto: CreateRoomBookingDto): Promise<RoomBooking>;
  findAll(query: Record<string, any>): Promise<RoomBooking[]>;
  findOne(id: string): Promise<RoomBooking | null>;
  findByRoomId(roomId: string): Promise<RoomBooking[]>;
  findByUserId(userId: string): Promise<RoomBooking[]>;
  update(id: string, updateRoomBookingDto: UpdateRoomBookingDto): Promise<RoomBooking>;
  remove(id: string): Promise<void>;
}

export interface IRoomBookingService {
  create(createRoomBookingDto: CreateRoomBookingDto, createdBy?: string): Promise<RoomBooking>;
  findAll(query?: Record<string, any>): Promise<RoomBooking[]>;
  findOne(id: string): Promise<RoomBooking | null>;
  findByRoomId(roomId: string): Promise<RoomBooking[]>;
  findByUserId(userId: string): Promise<RoomBooking[]>;
  update(id: string, updateRoomBookingDto: UpdateRoomBookingDto): Promise<RoomBooking>;
  remove(id: string): Promise<void>;
  addPayment(id: string, amount: number): Promise<RoomBooking>;
  releaseRoom(bookingId: string): Promise<RoomBooking>;
  calculateBalance(booking: RoomBooking): number;
}

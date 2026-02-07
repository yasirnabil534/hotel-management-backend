import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoomBooking } from '@prisma/client';
import { IRoomService } from '../rooms/room.interface';
import { CreateRoomBookingDto, UpdateRoomBookingDto } from './room-booking.dto';
import { IRoomBookingRepository, IRoomBookingService } from './room-booking.interface';

@Injectable()
export class RoomBookingService implements IRoomBookingService {
  constructor(
    @Inject('IRoomBookingRepository')
    private roomBookingRepository: IRoomBookingRepository,
    @Inject('IRoomService')
    private roomService: IRoomService,
  ) {}

  async create(createRoomBookingDto: CreateRoomBookingDto, createdBy?: string): Promise<RoomBooking> {
    try {
      // Check if the room exists and is available
      const room = await this.roomService.findOne(createRoomBookingDto.roomId);
      if (!room) {
        throw new NotFoundException(`Room with ID ${createRoomBookingDto.roomId} not found`);
      }
      if (room.status !== 'available') {
        throw new ConflictException(`Room is currently "${room.status}" and cannot be booked`);
      }

      // Calculate subtotal, total, and balance
      const subtotal = createRoomBookingDto.roomPrice * createRoomBookingDto.numberOfNights;
      const discount = createRoomBookingDto.discount || 0;
      const total = subtotal - discount;
      const paid = createRoomBookingDto.paid || 0;
      const balance = total - paid;

      // Validate dates
      const checkIn = new Date(createRoomBookingDto.checkInDate);
      const checkOut = new Date(createRoomBookingDto.checkOutDate);

      if (checkOut <= checkIn) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      const bookingData: any = {
        ...createRoomBookingDto,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        subtotal,
        total,
        balance,
        paid,
        discount,
      };

      if (createdBy) {
        bookingData.createdBy = createdBy;
      }

      const booking = await this.roomBookingRepository.create(bookingData);

      // Update room status to "booked"
      await this.roomService.update(createRoomBookingDto.roomId, { status: 'booked' });

      return booking;
    } catch (error) {
      console.error('Error creating room booking:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<RoomBooking[]> {
    try {
      return await this.roomBookingRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all room bookings:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<RoomBooking> {
    try {
      const booking = await this.roomBookingRepository.findOne(id);
      if (!booking) {
        throw new NotFoundException(`Room booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error finding room booking with id ${id}:`, error);
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<RoomBooking[]> {
    try {
      return await this.roomBookingRepository.findByRoomId(roomId);
    } catch (error) {
      console.error(`Error finding bookings for room ${roomId}:`, error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<RoomBooking[]> {
    try {
      return await this.roomBookingRepository.findByUserId(userId);
    } catch (error) {
      console.error(`Error finding bookings for user ${userId}:`, error);
      throw error;
    }
  }

  async update(id: string, updateRoomBookingDto: UpdateRoomBookingDto): Promise<RoomBooking> {
    try {
      const existingBooking = await this.findOne(id);

      // Recalculate if relevant fields are updated
      const roomPrice = updateRoomBookingDto.roomPrice ?? existingBooking.roomPrice;
      const numberOfNights = updateRoomBookingDto.numberOfNights ?? existingBooking.numberOfNights;
      const discount = updateRoomBookingDto.discount ?? existingBooking.discount;
      const paid = updateRoomBookingDto.paid ?? existingBooking.paid;

      const subtotal = roomPrice * numberOfNights;
      const total = subtotal - discount;
      const balance = total - paid;

      const updateData: any = {
        ...updateRoomBookingDto,
        subtotal,
        total,
        balance,
      };

      // Handle date updates
      if (updateRoomBookingDto.checkInDate) {
        updateData.checkInDate = new Date(updateRoomBookingDto.checkInDate);
      }
      if (updateRoomBookingDto.checkOutDate) {
        updateData.checkOutDate = new Date(updateRoomBookingDto.checkOutDate);
      }

      // Validate dates if both are being updated
      if (updateData.checkInDate && updateData.checkOutDate) {
        if (updateData.checkOutDate <= updateData.checkInDate) {
          throw new BadRequestException('Check-out date must be after check-in date');
        }
      }

      return await this.roomBookingRepository.update(id, updateData);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Room booking with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.roomBookingRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Room booking with ID ${id} not found`);
      }
      throw error;
    }
  }

  async addPayment(id: string, amount: number): Promise<RoomBooking> {
    try {
      const booking = await this.findOne(id);

      if (amount <= 0) {
        throw new BadRequestException('Payment amount must be greater than 0');
      }

      const newPaid = booking.paid + amount;
      const newBalance = booking.total - newPaid;

      if (newPaid > booking.total) {
        throw new BadRequestException('Payment amount exceeds total booking amount');
      }

      return await this.roomBookingRepository.update(id, {
        paid: newPaid,
      });
    } catch (error) {
      console.error(`Error adding payment to booking ${id}:`, error);
      throw error;
    }
  }

  async releaseRoom(bookingId: string): Promise<RoomBooking> {
    try {
      const booking = await this.findOne(bookingId);

      if (booking.status === 'checked-out' || booking.status === 'cancelled') {
        throw new BadRequestException(`Booking is already "${booking.status}" and the room has been released`);
      }

      // Update booking status to "checked-out"
      const updatedBooking = await this.roomBookingRepository.update(bookingId, {
        status: 'checked-out',
      });

      // Update room status back to "available"
      await this.roomService.update(booking.roomId, { status: 'available' });

      return updatedBooking;
    } catch (error) {
      console.error(`Error releasing room for booking ${bookingId}:`, error);
      throw error;
    }
  }

  calculateBalance(booking: RoomBooking): number {
    return booking.total - booking.paid;
  }
}

import { Injectable } from '@nestjs/common';
import { RoomBooking } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomBookingDto, UpdateRoomBookingDto } from './room-booking.dto';
import { IRoomBookingRepository } from './room-booking.interface';

@Injectable()
export class RoomBookingRepository implements IRoomBookingRepository {
  constructor(private prisma: PrismaService) {}

  async create(createRoomBookingDto: CreateRoomBookingDto): Promise<RoomBooking> {
    try {
      return await this.prisma.roomBooking.create({
        data: createRoomBookingDto as any,
        include: {
          room: true,
          user: true,
        },
      });
    } catch (error) {
      console.error('Error creating room booking in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<RoomBooking[]> {
    try {
      const { 
        page, 
        limit, 
        sortBy, 
        sortOrder, 
        search, 
        roomId, 
        userId, 
        hotelId, 
        status,
        phone,
        email,
        checkInFrom,
        checkInTo,
        checkOutFrom,
        checkOutTo,
        ...filters 
      } = query;
      
      const skip = page
        ? (parseInt(page || '1') - 1) * parseInt(limit || '10')
        : 1;
      const take = limit ? parseInt(limit) : 10;

      let orderBy = undefined;
      if (sortBy) {
        orderBy = {
          [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        };
      }

      const whereClause: any = { ...filters };

      // Filter by roomId
      if (roomId) {
        whereClause.roomId = roomId;
      }

      // Filter by userId
      if (userId) {
        whereClause.userId = userId;
      }

      // Filter by status
      if (status) {
        whereClause.status = status;
      }

      // Filter by phone
      if (phone) {
        whereClause.userPhone = {
          contains: phone,
          mode: 'insensitive',
        };
      }

      // Filter by email
      if (email) {
        whereClause.userEmail = {
          contains: email,
          mode: 'insensitive',
        };
      }

      // Filter by check-in date range
      if (checkInFrom || checkInTo) {
        whereClause.checkInDate = {};
        if (checkInFrom) {
          whereClause.checkInDate.gte = new Date(checkInFrom);
        }
        if (checkInTo) {
          whereClause.checkInDate.lte = new Date(checkInTo);
        }
      }

      // Filter by check-out date range
      if (checkOutFrom || checkOutTo) {
        whereClause.checkOutDate = {};
        if (checkOutFrom) {
          whereClause.checkOutDate.gte = new Date(checkOutFrom);
        }
        if (checkOutTo) {
          whereClause.checkOutDate.lte = new Date(checkOutTo);
        }
      }

      // Filter by hotelId (through room relation)
      if (hotelId) {
        whereClause.room = {
          hotelId: hotelId,
        };
      }

      // Search by user name, email, or phone
      if (search) {
        whereClause.OR = [
          {
            userName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            userEmail: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            userPhone: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      return await this.prisma.roomBooking.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
        include: {
          room: true,
          user: true,
        },
      });
    } catch (error) {
      console.error('Error finding all room bookings in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<RoomBooking | null> {
    try {
      return await this.prisma.roomBooking.findUnique({
        where: { id },
        include: {
          room: true,
          user: true,
        },
      });
    } catch (error) {
      console.error(`Error finding room booking with id ${id} in repository:`, error);
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<RoomBooking[]> {
    try {
      return await this.prisma.roomBooking.findMany({
        where: { roomId },
        include: {
          room: true,
          user: true,
        },
        orderBy: {
          checkInDate: 'desc',
        },
      });
    } catch (error) {
      console.error(`Error finding bookings by room id ${roomId} in repository:`, error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<RoomBooking[]> {
    try {
      return await this.prisma.roomBooking.findMany({
        where: { userId },
        include: {
          room: true,
          user: true,
        },
        orderBy: {
          checkInDate: 'desc',
        },
      });
    } catch (error) {
      console.error(`Error finding bookings by user id ${userId} in repository:`, error);
      throw error;
    }
  }

  async update(id: string, updateRoomBookingDto: UpdateRoomBookingDto): Promise<RoomBooking> {
    try {
      return await this.prisma.roomBooking.update({
        where: { id },
        data: updateRoomBookingDto as any,
        include: {
          room: true,
          user: true,
        },
      });
    } catch (error) {
      console.error(`Error updating room booking with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.roomBooking.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing room booking with id ${id} in repository:`, error);
      throw error;
    }
  }
}

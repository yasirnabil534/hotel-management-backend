import { Injectable } from '@nestjs/common';
import { RoomSession } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IRoomSessionRepository } from './room-session.interface';

@Injectable()
export class RoomSessionRepository implements IRoomSessionRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, any>): Promise<RoomSession[]> {
    try {
      const { 
        page, 
        limit, 
        sortBy, 
        sortOrder, 
        search, 
        roomId, 
        hotelId, 
        status,
        createdAtFrom,
        createdAtTo,
        ...filters 
      } = query;
      
      const skip = page
        ? (parseInt(page || '1') - 1) * parseInt(limit || '10')
        : 0;
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

      // Filter by status
      if (status) {
        whereClause.status = status;
      }

      // Filter by created date range
      if (createdAtFrom || createdAtTo) {
        whereClause.createdAt = {};
        if (createdAtFrom) {
          whereClause.createdAt.gte = new Date(createdAtFrom);
        }
        if (createdAtTo) {
          whereClause.createdAt.lte = new Date(createdAtTo);
        }
      }

      // Filter by hotelId directly
      if (hotelId) {
        whereClause.hotelId = hotelId;
      }

      return await this.prisma.roomSession.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
        include: {
          room: true,
        },
      });
    } catch (error) {
      console.error('Error finding all room sessions in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<RoomSession | null> {
    try {
      return await this.prisma.roomSession.findUnique({
        where: { id },
        include: {
          room: true,
        },
      });
    } catch (error) {
      console.error(`Error finding room session with id ${id} in repository:`, error);
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<RoomSession[]> {
    try {
      return await this.prisma.roomSession.findMany({
        where: { roomId },
        include: {
          room: true,
        },
      });
    } catch (error) {
      console.error(`Error finding room sessions by room id ${roomId} in repository:`, error);
      throw error;
    }
  }

  async create(data: { roomId: string; createdBy?: string; status?: string }): Promise<RoomSession> {
    try {
      return await this.prisma.roomSession.create({
        data,
        include: {
          room: true,
        },
      });
    } catch (error) {
      console.error('Error creating room session in repository:', error);
      throw error;
    }
  }

  async update(id: string, data: any): Promise<RoomSession> {
    try {
      return await this.prisma.roomSession.update({
        where: { id },
        data,
        include: {
          room: true,
        },
      });
    } catch (error) {
      console.error(`Error updating room session with id ${id} in repository:`, error);
      throw error;
    }
  }

  async updateMany(where: any, data: any): Promise<void> {
    try {
      await this.prisma.roomSession.updateMany({
        where,
        data,
      });
    } catch (error) {
      console.error('Error updating many room sessions in repository:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<RoomSession> {
    try {
      return await this.prisma.roomSession.delete({
        where: { id },
        include: {
          room: true,
        },
      });
    } catch (error) {
      console.error(`Error deleting room session with id ${id} in repository:`, error);
      throw error;
    }
  }
}

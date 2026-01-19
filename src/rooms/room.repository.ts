import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';
import { IRoomRepository } from './room.interface';

@Injectable()
export class RoomRepository implements IRoomRepository {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      // Generate 24-letter random code
      const roomCode = this.generateRoomCode();
      
      return await this.prisma.room.create({
        data: {
          ...createRoomDto,
          roomCode,
        },
      });
    } catch (error) {
      console.error('Error creating room in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<Room[]> {
    try {
      const { page, limit, sortBy, sortOrder, search, hotelId, status, ...filters } = query;
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
      
      let allFilters = { ...filters };
      
      // Filter by hotelId
      if (hotelId) {
        allFilters.hotelId = hotelId;
      }
      
      // Filter by status
      if (status) {
        allFilters.status = status;
      }
      
      if (search) {
        allFilters = {
          ...allFilters,
          AND: [
            {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  roomCode: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        };
      }

      return await this.prisma.room.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
      });
    } catch (error) {
      console.error('Error finding all rooms in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Room | null> {
    try {
      return await this.prisma.room.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding room with id ${id} in repository:`, error);
      throw error;
    }
  }

  async findByRoomCode(roomCode: string): Promise<Room | null> {
    try {
      return await this.prisma.room.findUnique({
        where: { roomCode },
      });
    } catch (error) {
      console.error(`Error finding room with code ${roomCode} in repository:`, error);
      throw error;
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    try {
      return await this.prisma.room.update({
        where: { id },
        data: updateRoomDto,
      });
    } catch (error) {
      console.error(`Error updating room with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.room.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing room with id ${id} in repository:`, error);
      throw error;
    }
  }

  private generateRoomCode(): string {
    // Include uppercase, lowercase, numbers, and special characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < 24; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { Hotel } from './hotel.entity';
import { IHotelRepository } from './hotel.interface';

@Injectable()
export class HotelRepository implements IHotelRepository {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    try {
      return await this.prisma.hotel.create({
        data: createHotelDto,
        // include: { owner: true },
      });
    } catch (error) {
      console.error('Error creating hotel in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<Hotel[]> {
    try {
      const { page, limit, sortBy, sortOrder, search, ...filters } = query;
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
      let allFilters = { ...filters };
      if (search) {
        allFilters = {
          ...allFilters,
          AND: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        };
      }

      return await this.prisma.hotel.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
        // include: { owner: true },
      });
    } catch (error) {
      console.error('Error finding all hotels in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Hotel | null> {
    try {
      return await this.prisma.hotel.findUnique({
        where: { id },
        // include: { owner: true },
      });
    } catch (error) {
      console.error(`Error finding hotel with id ${id} in repository:`, error);
      throw error;
    }
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    try {
      return await this.prisma.hotel.update({
        where: { id },
        data: updateHotelDto,
        // include: { owner: true },
      });
    } catch (error) {
      console.error(`Error updating hotel with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.hotel.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing hotel with id ${id} in repository:`, error);
      throw error;
    }
  }
}

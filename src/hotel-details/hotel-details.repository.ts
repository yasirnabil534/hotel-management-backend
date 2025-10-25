import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDetailsDto, UpdateHotelDetailsDto } from './hotel-details.dto';
import { HotelDetails } from './hotel-details.entity';
import { IHotelDetailsRepository } from './hotel-details.interface';

@Injectable()
export class HotelDetailsRepository implements IHotelDetailsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDetailsDto: CreateHotelDetailsDto): Promise<HotelDetails> {
    try {
      return await this.prisma.hotelDetails.create({
        data: createHotelDetailsDto,
      });
    } catch (error) {
      console.error('Error creating hotel details in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<HotelDetails[]> {
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
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        };
      }

      return await this.prisma.hotelDetails.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
      });
    } catch (error) {
      console.error('Error finding all hotel details in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<HotelDetails | null> {
    try {
      return await this.prisma.hotelDetails.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding hotel details with id ${id} in repository:`, error);
      throw error;
    }
  }

  async update(id: string, updateHotelDetailsDto: UpdateHotelDetailsDto): Promise<HotelDetails> {
    try {
      return await this.prisma.hotelDetails.update({
        where: { id },
        data: updateHotelDetailsDto,
      });
    } catch (error) {
      console.error(`Error updating hotel details with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.hotelDetails.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing hotel details with id ${id} in repository:`, error);
      throw error;
    }
  }
}


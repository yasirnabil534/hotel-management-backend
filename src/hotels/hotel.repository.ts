import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { Hotel } from './hotel.entity';
import { IHotelRepository } from './hotel.interface';

@Injectable()
export class HotelRepository implements IHotelRepository {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.create({
      data: createHotelDto,
      include: { owner: true },
    });
  }

  async findAll(query: Record<string, any>): Promise<Hotel[]> {
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

    return this.prisma.hotel.findMany({
      where: allFilters,
      skip,
      take,
      orderBy,
      include: { owner: true },
    });
  }

  async findOne(id: string): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({
      where: { id },
      data: updateHotelDto,
      include: { owner: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.hotel.delete({
      where: { id },
    });
  }
}

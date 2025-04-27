import { Injectable } from '@nestjs/common';
import { Service } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { IServiceRepository } from './service.interface';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  async findAll(query: Record<string, any>): Promise<Service[]> {
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

    return this.prisma.service.findMany({
      where: allFilters,
      skip,
      take,
      orderBy,
    });
  }

  async findOne(id: string): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  async findByHotel(hotelId: string): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { hotelId },
    });
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }
}

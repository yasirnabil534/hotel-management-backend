import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { ICategoryRepository } from './category.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: createCategoryDto,
      include: { service: true, hotel: true },
    });
  }

  async findAll(query: Record<string, any>): Promise<Category[]> {
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

    return this.prisma.category.findMany({
      where: allFilters,
      skip,
      take,
      orderBy,
      include: { service: true, hotel: true },
    });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: { service: true, hotel: true },
    });
  }

  async findByHotel(hotelId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { hotelId },
      include: { service: true, hotel: true },
    });
  }

  async findByService(serviceId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { serviceId },
      include: { service: true, hotel: true },
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: { service: true, hotel: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}

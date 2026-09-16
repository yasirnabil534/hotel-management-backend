import { ConflictException, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { ICategoryRepository } from './category.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
        // include: { service: true, hotel: true },
      });
    } catch (error) {
      console.error('Error creating category in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<Category[]> {
    try {
      const { page, limit, sortBy, sortOrder, search, hotelId, ...filters } = query;
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

      // Filter by hotelId
      if (hotelId) {
        allFilters.hotelId = hotelId;
      }

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

      return await this.prisma.category.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
        // include: { service: true, hotel: true },
      });
    } catch (error) {
      console.error('Error finding all categories in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Category | null> {
    try {
      return await this.prisma.category.findUnique({
        where: { id },
        // include: { service: true, hotel: true },
      });
    } catch (error) {
      console.error(`Error finding category with id ${id} in repository:`, error);
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { hotelId },
        // include: { service: true, hotel: true },
      });
    } catch (error) {
      console.error(`Error finding categories for hotel ${hotelId} in repository:`, error);
      throw error;
    }
  }

  async findByService(serviceId: string): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { serviceId },
        // include: { service: true, hotel: true },
      });
    } catch (error) {
      console.error(`Error finding categories for service ${serviceId} in repository:`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        // include: { service: true, hotel: true },
      });
    } catch (error) {
      console.error(`Error updating category with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const children = await this.prisma.category.count({ where: { parentId: id } });
    if (children > 0) {
      throw new ConflictException(
        `Category has ${children} sub-categor${children > 1 ? 'ies' : 'y'}; delete them first.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({ where: { categoryId: id } });
      await tx.category.delete({ where: { id } });
    });
  }

  async countChildren(parentId: string): Promise<number> {
    return this.prisma.category.count({ where: { parentId } });
  }
}

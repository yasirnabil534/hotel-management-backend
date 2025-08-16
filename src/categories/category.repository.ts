import { Injectable } from '@nestjs/common';
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
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing category with id ${id} in repository:`, error);
      throw error;
    }
  }
}

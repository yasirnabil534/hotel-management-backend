import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { IProductRepository } from './product.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return this.prisma.product.create({
        data: createProductDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<Product[]> {
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

      return this.prisma.product.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      return this.prisma.product.findUnique({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByService(serviceId: string): Promise<Product[]> {
    try {
      return this.prisma.product.findMany({
        where: { serviceId },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<Product[]> {
    try {
      return this.prisma.product.findMany({
        where: { hotelId },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

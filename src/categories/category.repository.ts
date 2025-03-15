import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from '@prisma/client';
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

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
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
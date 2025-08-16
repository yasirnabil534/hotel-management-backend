import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from '@prisma/client';
import { ICategoryService, ICategoryRepository } from './category.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoryRepository.create(createCategoryDto);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<Category[]> {
    try {
      return await this.categoryRepository.findAll(query);
    } catch (error) {
      console.error('Error finding all categories:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Category | null> {
    try {
      return await this.categoryRepository.findOne(id);
    } catch (error) {
      console.error(`Error finding category with id ${id}:`, error);
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<Category[]> {
    try {
      return await this.categoryRepository.findByHotel(hotelId);
    } catch (error) {
      console.error(`Error finding categories for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  async findByService(serviceId: string): Promise<Category[]> {
    try {
      return await this.categoryRepository.findByService(serviceId);
    } catch (error) {
      console.error(`Error finding categories for service ${serviceId}:`, error);
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      return await this.categoryRepository.remove(id);
    } catch (error) {
      console.error(`Error removing category with id ${id}:`, error);
      throw error;
    }
  }
}
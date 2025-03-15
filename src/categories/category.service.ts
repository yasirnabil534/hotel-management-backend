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

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne(id);
  }

  findByHotel(hotelId: string): Promise<Category[]> {
    return this.categoryRepository.findByHotel(hotelId);
  }

  findByService(serviceId: string): Promise<Category[]> {
    return this.categoryRepository.findByService(serviceId);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string): Promise<void> {
    return this.categoryRepository.remove(id);
  }
}
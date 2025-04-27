import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export interface ICategoryRepository {
  create(createCategoryDto: CreateCategoryDto): Promise<Category>;
  findAll(query: Record<string, any>): Promise<Category[]>;
  findOne(id: string): Promise<Category | null>;
  findByHotel(hotelId: string): Promise<Category[]>;
  findByService(serviceId: string): Promise<Category[]>;
  update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
  remove(id: string): Promise<void>;
}

export interface ICategoryService {
  create(createCategoryDto: CreateCategoryDto): Promise<Category>;
  findAll(query: Record<string, any>): Promise<Category[]>;
  findOne(id: string): Promise<Category | null>;
  findByHotel(hotelId: string): Promise<Category[]>;
  findByService(serviceId: string): Promise<Category[]>;
  update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
  remove(id: string): Promise<void>;
}
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { IProductRepository, IProductService } from './product.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return this.productRepository.create(createProductDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Product[]> {
    try {
      return this.productRepository.findAll(query || {});
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async findByService(serviceId: string): Promise<Product[]> {
    try {
      return this.productRepository.findByService(serviceId);
    } catch (error) {
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<Product[]> {
    try {
      return this.productRepository.findByHotel(hotelId);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.productRepository.update(id, updateProductDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.productRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }
}
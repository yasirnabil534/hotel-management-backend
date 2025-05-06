import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

export interface IProductService {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(query: Record<string, any>): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  findByService(serviceId: string): Promise<Product[]>;
  findByHotel(hotelId: string): Promise<Product[]>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}

export interface IProductRepository {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(query: Record<string, any>): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  findByService(serviceId: string): Promise<Product[]>;
  findByHotel(hotelId: string): Promise<Product[]>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}

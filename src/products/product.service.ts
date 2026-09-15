import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
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
      this.validateImagePayload(createProductDto.images);
      return this.productRepository.create(createProductDto);
    } catch (error) {
      this.handlePrismaError(error);
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
      this.handlePrismaError(error, id);
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
      this.validateImagePayload(updateProductDto.images);
      return await this.productRepository.update(id, updateProductDto);
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.productRepository.remove(id);
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  /**
   * Defense-in-depth: reject images arrays whose combined base64 length
   * exceeds 15 MB (BODY_LIMIT_MB). Prisma/Fastify already blocks at the
   * transport layer, but this catches edge cases (pre-parsed bodies, etc.).
   * Full-replace semantics: the frontend always sends the complete final list.
   */
  private validateImagePayload(images?: string[]): void {
    if (!images || images.length === 0) return;
    const LIMIT_BYTES = 15 * 1024 * 1024; // 15 MB in chars ≈ bytes for base64
    const totalLength = images.reduce((sum, img) => sum + img.length, 0);
    if (totalLength > LIMIT_BYTES) {
      throw new PayloadTooLargeException(
        `Images payload too large (${Math.round(totalLength / 1024 / 1024)} MB). Maximum is 15 MB total.`,
      );
    }
  }

  /**
   * Maps Prisma error codes to appropriate NestJS HTTP exceptions.
   * P2025 → 404 Not Found
   * P2002 → 409 Conflict (duplicate)
   * P2023 → 400 Bad Request (malformed ObjectId)
   */
  private handlePrismaError(error: any, id?: string): never {
    if (error?.status) {
      // Already a NestJS HTTP exception (e.g. NotFoundException) — re-throw as-is
      throw error;
    }
    switch (error?.code) {
      case 'P2025':
        throw new NotFoundException(
          id ? `Product with ID ${id} not found` : 'Record not found',
        );
      case 'P2002':
        throw new ConflictException('Duplicate record');
      case 'P2023':
        throw new BadRequestException('Malformed id');
      default:
        throw error;
    }
  }
}
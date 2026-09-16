import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from '@prisma/client';
import { ICategoryService, ICategoryRepository } from './category.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  /**
   * Validates that the given parentId is a valid root category for the tree.
   * Throws BadRequestException for format errors, self-reference, cross-service parents,
   * and grandchild attempts (parentId points to a category that already has a parent).
   */
  private async assertValidParent(
    parentId: string,
    serviceId?: string,
    selfId?: string,
  ): Promise<void> {
    if (!/^[0-9a-fA-F]{24}$/.test(parentId)) {
      throw new BadRequestException(
        'Invalid parentId format — must be a 24-character hex string',
      );
    }
    if (selfId && parentId === selfId) {
      throw new BadRequestException('A category cannot be its own parent');
    }
    const parent = await this.categoryRepository.findOne(parentId);
    if (!parent) {
      throw new NotFoundException(
        `Parent category with ID ${parentId} not found`,
      );
    }
    if (parent.parentId) {
      throw new BadRequestException(
        'Cannot nest more than one level — the parent is itself a sub-category',
      );
    }
    if (serviceId && parent.serviceId !== serviceId) {
      throw new BadRequestException(
        'Parent category belongs to a different service',
      );
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const { parentId, serviceId } = createCategoryDto;
      if (parentId != null && parentId !== '') {
        await this.assertValidParent(parentId, serviceId);
      }
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
      console.error(
        `Error finding categories for service ${serviceId}:`,
        error,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const { parentId } = updateCategoryDto;

      // C1.4 — block parent changes for categories that already have children
      // (applies when parentId key is present, whether string or null)
      if ('parentId' in updateCategoryDto) {
        const childCount = await this.categoryRepository.countChildren(id);
        if (childCount > 0) {
          throw new BadRequestException(
            "Category has sub-categories — its parent cannot be changed",
          );
        }
      }

      // C1.3 — parentId update semantics:
      //   absent (key not in dto)  → parent unchanged (Prisma skips undefined)
      //   string value             → validate then re-parent
      //   explicit null            → promote to top-level (skip assertValidParent)
      if (typeof parentId === 'string') {
        // Fetch current record to get serviceId for cross-service check
        const current = await this.categoryRepository.findOne(id);
        if (!current) {
          throw new NotFoundException(`Category with ID ${id} not found`);
        }
        await this.assertValidParent(parentId, current.serviceId, id);
      }
      // parentId === null or key absent: let Prisma handle it as-is

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
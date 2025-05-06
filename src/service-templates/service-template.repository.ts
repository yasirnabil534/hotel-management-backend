import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceTemplateDto,
  UpdateServiceTemplateDto,
} from './service-template.dto';
import { IServiceTemplateRepository } from './service-template.interface';
import { ServiceTemplate } from './service-template.entity';

@Injectable()
export class ServiceTemplateRepository implements IServiceTemplateRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createServiceTemplateDto: CreateServiceTemplateDto,
  ): Promise<ServiceTemplate> {
    return this.prisma.serviceTemplate.create({
      data: createServiceTemplateDto,
    });
  }

  async findAll(query: Record<string, any>): Promise<ServiceTemplate[]> {
    const { page, limit, sortBy, sortOrder, search, ...filters } = query;
    const skip = page ? (parseInt(page) - 1) * parseInt(limit || '10') : 0;
    const take = limit ? parseInt(limit) : 10;

    let orderBy = undefined;
    if (sortBy) {
      orderBy = {
        [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      };
    }

    let where = { ...filters };
    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    return this.prisma.serviceTemplate.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async findOne(id: string): Promise<ServiceTemplate | null> {
    return this.prisma.serviceTemplate.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate> {
    return this.prisma.serviceTemplate.update({
      where: { id },
      data: updateServiceTemplateDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.serviceTemplate.delete({
      where: { id },
    });
  }
}

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
    try {
      return await this.prisma.serviceTemplate.create({
        data: createServiceTemplateDto,
      });
    } catch (error) {
      console.error('Error creating service template in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<ServiceTemplate[]> {
    try {
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

      return await this.prisma.serviceTemplate.findMany({
        where,
        skip,
        take,
        orderBy,
      });
    } catch (error) {
      console.error('Error finding all service templates in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<ServiceTemplate | null> {
    try {
      return await this.prisma.serviceTemplate.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding service template with id ${id} in repository:`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate> {
    try {
      return await this.prisma.serviceTemplate.update({
        where: { id },
        data: updateServiceTemplateDto,
      });
    } catch (error) {
      console.error(`Error updating service template with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.serviceTemplate.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing service template with id ${id} in repository:`, error);
      throw error;
    }
  }
}

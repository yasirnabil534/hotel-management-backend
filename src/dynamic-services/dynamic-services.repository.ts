import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSystemServiceDto,
  UpdateSystemServiceDto,
} from './dynamic-services.dto';
import { ISystemServiceRepository } from './dynamic-services.interface';
import { SystemService } from './dynamic-services.dto';
import { ServiceTemplate } from 'src/service-templates/service-template.entity';

@Injectable()
export class DynamicServicesRepository implements ISystemServiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createSystemServiceDto: CreateSystemServiceDto,
  ): Promise<SystemService> {
    try {
      return this.prisma.systemService.create({
        data: {
          name: createSystemServiceDto.name,
          description: createSystemServiceDto.description,
          image: createSystemServiceDto.image,
          link: createSystemServiceDto.link,
          hotelId: createSystemServiceDto.hotelId,
          serviceTemplateId: createSystemServiceDto.serviceTemplateId,
        },
        // include: {
        //   hotel: true,
        //   systemService: true,
        // },
      });
    } catch (error) {
      console.error('Error creating system service:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<SystemService[]> {
    try {
      const { page, limit, sortBy, sortOrder, search, ...filters } = query || {};
      const skip = page ? (parseInt(page) - 1) * parseInt(limit || '10') : 0;
      const take = limit ? parseInt(limit) : 10;

      let orderBy = undefined;
      if (sortBy) {
        orderBy = {
          [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        };
      }

      let allFilters = { ...filters };
      if (search) {
        allFilters = {
          ...allFilters,
          isActive: true,
          AND: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        };
      }

      return this.prisma.systemService.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
        // include: {
        //   hotel: true,
        //   systemService: true,
        // },
      });
    } catch (error) {
      console.error('Error finding all system services:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<SystemService | null> {
    try {
      return this.prisma.systemService.findUnique({
        where: { id },
        // include: {
        //   hotel: true,
        //   systemService: true,
        // },
      });
    } catch (error) {
      console.error(`Error finding system service with id ${id}:`, error);
      throw error;
    }
  }

  async findByHotel(hotelId: string): Promise<SystemService[]> {
    try {
      return this.prisma.systemService.findMany({
        where: { hotelId },
        // include: {
        //   hotel: true,
        //   systemService: true,
        // },
      });
    } catch (error) {
      console.error('Error finding services by hotel:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSystemServiceDto: UpdateSystemServiceDto,
  ): Promise<SystemService> {
    try {
      return this.prisma.systemService.update({
        where: { id },
        data: updateSystemServiceDto,
        // include: {
        //   hotel: true,
        //   systemService: true,
        // },
      });
    } catch (error) {
      console.error(`Error updating system service with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.systemService.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findServicetemplateById(id: string): Promise<ServiceTemplate> {
    try {
      return this.prisma.serviceTemplate.findFirst({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async changeStatus(id: string, status: boolean): Promise<SystemService> {
    try {
      return this.prisma.systemService.update({
        where: { id },
        data: { isActive: status },
      });
    } catch (error) {
      throw error;
    }
  }

  async findInactiveServices(): Promise<SystemService[]> {
    try {
      return this.prisma.systemService.findMany({
        where: { isActive: false },
      });
    } catch (error) {
      throw error;
    }
  }
}

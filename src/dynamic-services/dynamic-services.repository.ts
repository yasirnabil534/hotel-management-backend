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
    return this.prisma.systemService.create({
      data: {
        name: createSystemServiceDto.name,
        description: createSystemServiceDto.description,
        image: createSystemServiceDto.image,
        link: createSystemServiceDto.link,
        hotelId: createSystemServiceDto.hotelId,
        serviceTemplateId: createSystemServiceDto.serviceTemplateId,
      },
      include: {
        hotel: true,
        systemService: true,
      },
    });
  }

  async findAll(query?: Record<string, any>): Promise<SystemService[]> {
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
      include: {
        hotel: true,
        systemService: true,
      },
    });
  }

  async findOne(id: string): Promise<SystemService | null> {
    return this.prisma.systemService.findUnique({
      where: { id },
      include: {
        hotel: true,
        systemService: true,
      },
    });
  }

  async findByHotel(hotelId: string): Promise<SystemService[]> {
    return this.prisma.systemService.findMany({
      where: { hotelId },
      include: {
        hotel: true,
        systemService: true,
      },
    });
  }

  async update(
    id: string,
    updateSystemServiceDto: UpdateSystemServiceDto,
  ): Promise<SystemService> {
    return this.prisma.systemService.update({
      where: { id },
      data: updateSystemServiceDto,
      include: {
        hotel: true,
        systemService: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.systemService.delete({
      where: { id },
    });
  }

  async findServicetemplateById(id: string): Promise<ServiceTemplate> {
    return this.prisma.serviceTemplate.findFirst({
      where: { id },
    });
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSystemServiceDto,
  UpdateSystemServiceDto,
} from './dynamic-services.dto';
import {
  ISystemServiceRepository,
  ISystemServiceService,
} from './dynamic-services.interface';
import { SystemService } from './dynamic-services.dto';

@Injectable()
export class DynamicServicesService implements ISystemServiceService {
  constructor(
    @Inject('ISystemServiceRepository')
    private readonly systemServiceRepository: ISystemServiceRepository,
  ) {}

  async create(
    createSystemServiceDto: CreateSystemServiceDto,
  ): Promise<SystemService> {
    const { name, link, image, description } = await this.systemServiceRepository.findServicetemplateById(
        createSystemServiceDto.serviceTemplateId,
    )
    return this.systemServiceRepository.create({
      ...createSystemServiceDto,
      name,
      link,
      image,
      description,
    });
  }

  async findAll(query?: Record<string, any>): Promise<SystemService[]> {
    return this.systemServiceRepository.findAll(query || {});
  }

  async findOne(id: string): Promise<SystemService> {
    const systemService = await this.systemServiceRepository.findOne(id);
    if (!systemService) {
      throw new NotFoundException(`System service with ID ${id} not found`);
    }
    return systemService;
  }

  async findByHotel(hotelId: string): Promise<SystemService[]> {
    return this.systemServiceRepository.findByHotel(hotelId);
  }

  async update(
    id: string,
    updateSystemServiceDto: UpdateSystemServiceDto,
  ): Promise<SystemService> {
    try {
      return await this.systemServiceRepository.update(
        id,
        updateSystemServiceDto,
      );
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`System service with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.systemServiceRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`System service with ID ${id} not found`);
      }
      throw error;
    }
  }
}

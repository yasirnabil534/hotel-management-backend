import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@prisma/client';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { IServiceRepository, IServiceService } from './service.interface';

@Injectable()
export class ServicesService implements IServiceService {
  constructor(
    @Inject('IServiceRepository')
    private serviceRepository: IServiceRepository
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceRepository.create(createServiceDto);
  }

  async findAll(query?: Record<string, any>): Promise<Service[]> {
    return this.serviceRepository.findAll(query || {});
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByHotel(hotelId: string): Promise<Service[]> {
    return this.serviceRepository.findByHotel(hotelId);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    try {
      return await this.serviceRepository.update(id, updateServiceDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.serviceRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      throw error;
    }
  }
}
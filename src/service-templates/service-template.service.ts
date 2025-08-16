import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IServiceTemplateRepository } from './service-template.interface';
import {
  CreateServiceTemplateDto,
  UpdateServiceTemplateDto,
} from './service-template.dto';
import { ServiceTemplate } from './service-template.dto';

@Injectable()
export class ServiceTemplateService {
  constructor(
    @Inject('IServiceTemplateRepository')
    private readonly serviceTemplateRepository: IServiceTemplateRepository,
  ) {}

  async create(
    createServiceTemplateDto: CreateServiceTemplateDto,
  ): Promise<ServiceTemplate> {
    try {
      return await this.serviceTemplateRepository.create(createServiceTemplateDto);
    } catch (error) {
      console.error('Error creating service template:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<ServiceTemplate[]> {
    try {
      return await this.serviceTemplateRepository.findAll(query);
    } catch (error) {
      console.error('Error finding all service templates:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<ServiceTemplate> {
    try {
      const template = await this.serviceTemplateRepository.findOne(id);
      if (!template) {
        throw new NotFoundException(`Service template with ID ${id} not found`);
      }
      return template;
    } catch (error) {
      console.error(`Error finding service template with id ${id}:`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate> {
    try {
      await this.findOne(id);
      return await this.serviceTemplateRepository.update(id, updateServiceTemplateDto);
    } catch (error) {
      console.error(`Error updating service template with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.serviceTemplateRepository.remove(id);
    } catch (error) {
      console.error(`Error removing service template with id ${id}:`, error);
      throw error;
    }
  }
}

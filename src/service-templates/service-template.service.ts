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
    return this.serviceTemplateRepository.create(createServiceTemplateDto);
  }

  async findAll(query: Record<string, any>): Promise<ServiceTemplate[]> {
    return this.serviceTemplateRepository.findAll(query);
  }

  async findOne(id: string): Promise<ServiceTemplate> {
    const template = await this.serviceTemplateRepository.findOne(id);
    if (!template) {
      throw new NotFoundException(`Service template with ID ${id} not found`);
    }
    return template;
  }

  async update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate> {
    await this.findOne(id);
    return this.serviceTemplateRepository.update(id, updateServiceTemplateDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.serviceTemplateRepository.remove(id);
  }
}

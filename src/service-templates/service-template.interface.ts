import {
  CreateServiceTemplateDto,
  UpdateServiceTemplateDto,
} from './service-template.dto';

export interface IServiceTemplateRepository {
  create(
    createServiceTemplateDto: CreateServiceTemplateDto,
  ): Promise<ServiceTemplate>;
  findAll(query?: Record<string, any>): Promise<ServiceTemplate[]>;
  findOne(id: string): Promise<ServiceTemplate | null>;
  update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate>;
  remove(id: string): Promise<void>;
}

export interface IServiceTemplateService {
  create(
    createServiceTemplateDto: CreateServiceTemplateDto,
  ): Promise<ServiceTemplate>;
  findAll(query?: Record<string, any>): Promise<ServiceTemplate[]>;
  findOne(id: string): Promise<ServiceTemplate>;
  update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate>;
  remove(id: string): Promise<void>;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  image: string;
  description: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceTemplateRepository {
  create(
    createServiceTemplateDto: CreateServiceTemplateDto,
  ): Promise<ServiceTemplate>;
  findAll(query: Record<string, any>): Promise<ServiceTemplate[]>;
  findOne(id: string): Promise<ServiceTemplate | null>;
  update(
    id: string,
    updateServiceTemplateDto: UpdateServiceTemplateDto,
  ): Promise<ServiceTemplate>;
  remove(id: string): Promise<void>;
}

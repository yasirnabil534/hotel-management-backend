import {
  CreateSystemServiceDto,
  UpdateSystemServiceDto,
  SystemService,
} from './dynamic-services.dto';
import { ServiceTemplate } from 'src/service-templates/service-template.entity';

export interface ISystemServiceRepository {
  create(
    createSystemServiceDto: CreateSystemServiceDto,
  ): Promise<SystemService>;
  findAll(query?: Record<string, any>): Promise<SystemService[]>;
  findOne(id: string): Promise<SystemService | null>;
  findByHotel(hotelId: string): Promise<SystemService[]>;
  update(
    id: string,
    updateSystemServiceDto: UpdateSystemServiceDto,
  ): Promise<SystemService>;
  remove(id: string): Promise<void>;
  findServicetemplateById(id: string): Promise<ServiceTemplate>;
}

export interface ISystemServiceService {
  create(
    createSystemServiceDto: CreateSystemServiceDto,
  ): Promise<SystemService>;
  findAll(query?: Record<string, any>): Promise<SystemService[]>;
  findOne(id: string): Promise<SystemService>;
  findByHotel(hotelId: string): Promise<SystemService[]>;
  update(
    id: string,
    updateSystemServiceDto: UpdateSystemServiceDto,
  ): Promise<SystemService>;
  remove(id: string): Promise<void>;
}

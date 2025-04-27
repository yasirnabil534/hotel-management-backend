import { Service } from './service.entity';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';

export interface IServiceRepository {
  create(createServiceDto: CreateServiceDto): Promise<Service>;
  findAll(query?: Record<string, any>): Promise<Service[]>;
  findOne(id: string): Promise<Service | null>;
  findByHotel(hotelId: string): Promise<Service[]>;
  update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
  remove(id: string): Promise<void>;
}

export interface IServiceService {
  create(createServiceDto: CreateServiceDto): Promise<Service>;
  findAll(query?: Record<string, any>): Promise<Service[]>;
  findOne(id: string): Promise<Service>;
  findByHotel(hotelId: string): Promise<Service[]>;
  update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
  remove(id: string): Promise<void>;
}
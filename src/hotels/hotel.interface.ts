import { Hotel } from './hotel.entity';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';

export interface IHotelRepository {
  create(createHotelDto: CreateHotelDto): Promise<Hotel>;
  findAll(): Promise<Hotel[]>;
  findOne(id: string): Promise<Hotel | null>;
  update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel>;
  remove(id: string): Promise<void>;
}

export interface IHotelService {
  create(createHotelDto: CreateHotelDto): Promise<Hotel>;
  findAll(): Promise<Hotel[]>;
  findOne(id: string): Promise<Hotel>;
  update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel>;
  remove(id: string): Promise<void>;
}
import { CreateHotelDetailsDto, UpdateHotelDetailsDto } from './hotel-details.dto';
import { HotelDetails } from './hotel-details.entity';

export interface IHotelDetailsRepository {
  create(createHotelDetailsDto: CreateHotelDetailsDto): Promise<HotelDetails>;
  findAll(query: Record<string, any>): Promise<HotelDetails[]>;
  findOne(id: string): Promise<HotelDetails | null>;
  update(id: string, updateHotelDetailsDto: UpdateHotelDetailsDto): Promise<HotelDetails>;
  remove(id: string): Promise<void>;
}

export interface IHotelDetailsService {
  create(createHotelDetailsDto: CreateHotelDetailsDto): Promise<HotelDetails>;
  findAll(query: Record<string, any>): Promise<HotelDetails[]>;
  findOne(id: string): Promise<HotelDetails>;
  update(id: string, updateHotelDetailsDto: UpdateHotelDetailsDto): Promise<HotelDetails>;
  remove(id: string): Promise<void>;
}


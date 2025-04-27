import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Hotel } from './hotel.entity';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { IHotelRepository, IHotelService } from './hotel.interface';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @Inject('IHotelRepository')
    private hotelRepository: IHotelRepository,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    return this.hotelRepository.create(createHotelDto);
  }

  async findAll(query?: Record<string, any>): Promise<Hotel[]> {
    return this.hotelRepository.findAll(query || {});
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne(id);
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    try {
      return await this.hotelRepository.update(id, updateHotelDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hotel with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.hotelRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hotel with ID ${id} not found`);
      }
      throw error;
    }
  }
}

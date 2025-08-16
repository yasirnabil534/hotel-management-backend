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
    try {
      return await this.hotelRepository.create(createHotelDto);
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Hotel[]> {
    try {
      return await this.hotelRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all hotels:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Hotel> {
    try {
      const hotel = await this.hotelRepository.findOne(id);
      if (!hotel) {
        throw new NotFoundException(`Hotel with ID ${id} not found`);
      }
      return hotel;
    } catch (error) {
      console.error(`Error finding hotel with id ${id}:`, error);
      throw error;
    }
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

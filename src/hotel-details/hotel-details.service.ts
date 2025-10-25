import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelDetailsDto, UpdateHotelDetailsDto } from './hotel-details.dto';
import { HotelDetails } from './hotel-details.entity';
import { IHotelDetailsRepository, IHotelDetailsService } from './hotel-details.interface';

@Injectable()
export class HotelDetailsService implements IHotelDetailsService {
  constructor(
    @Inject('IHotelDetailsRepository')
    private hotelDetailsRepository: IHotelDetailsRepository,
  ) {}

  async create(createHotelDetailsDto: CreateHotelDetailsDto): Promise<HotelDetails> {
    try {
      return await this.hotelDetailsRepository.create(createHotelDetailsDto);
    } catch (error) {
      console.error('Error creating hotel details:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<HotelDetails[]> {
    try {
      return await this.hotelDetailsRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all hotel details:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<HotelDetails> {
    try {
      const hotelDetails = await this.hotelDetailsRepository.findOne(id);
      if (!hotelDetails) {
        throw new NotFoundException(`Hotel details with ID ${id} not found`);
      }
      return hotelDetails;
    } catch (error) {
      console.error(`Error finding hotel details with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, updateHotelDetailsDto: UpdateHotelDetailsDto): Promise<HotelDetails> {
    try {
      return await this.hotelDetailsRepository.update(id, updateHotelDetailsDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hotel details with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.hotelDetailsRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hotel details with ID ${id} not found`);
      }
      throw error;
    }
  }
}


import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { Hotel } from './hotel.entity';
import { IHotelRepository } from './hotel.interface';

@Injectable()
export class HotelRepository implements IHotelRepository {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.create({
      data: createHotelDto,
      include: { owner: true },
    });
  }

  async findAll(): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({
      include: { owner: true },
    });
  }

  async findOne(id: string): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({
      where: { id },
      data: updateHotelDto,
      include: { owner: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.hotel.delete({
      where: { id },
    });
  }
}

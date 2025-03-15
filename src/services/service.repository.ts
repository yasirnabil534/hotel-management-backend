import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { IServiceRepository } from './service.interface';
import { Service } from '@prisma/client';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  async findAll(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }

  async findOne(id: string): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  async findByHotel(hotelId: string): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { hotelId },
    });
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }
}
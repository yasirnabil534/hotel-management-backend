import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { IUserRepository } from './user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(query: Record<string, any>): Promise<User[]> {
    const { page, limit, sortBy, sortOrder, search, ...filters } = query;
    const skip = page
      ? (parseInt(page || '1') - 1) * parseInt(limit || '10')
      : 1;
    const take = limit ? parseInt(limit) : 10;

    let orderBy = undefined;
    if (sortBy) {
      orderBy = {
        [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      };
    }
    let allFilters = { ...filters };
    if (search) {
      allFilters = {
        ...allFilters,
        AND: [
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return this.prisma.user.findMany({
      where: allFilters,
      skip,
      take,
      orderBy,
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}

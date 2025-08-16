import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { IUserRepository } from './user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      console.error('Error creating user in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<User[]> {
    try {
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

      return await this.prisma.user.findMany({
        where: allFilters,
        skip,
        take,
        orderBy,
      });
    } catch (error) {
      console.error('Error finding all users in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding user with id ${id} in repository:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error(`Error finding user with email ${email} in repository:`, error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      console.error(`Error updating user with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing user with id ${id} in repository:`, error);
      throw error;
    }
  }
}

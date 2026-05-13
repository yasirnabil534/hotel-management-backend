import { Injectable } from '@nestjs/common';
import { MealItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMealItemDto,
  CreateMealPlanDto,
  UpdateMealItemDto,
  UpdateMealPlanDto,
} from './meal-plan.dto';
import { IMealPlanRepository, MealPlanWithItems } from './meal-plan.interface';

@Injectable()
export class MealPlanRepository implements IMealPlanRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMealPlanDto, createdBy?: string): Promise<MealPlanWithItems> {
    try {
      const { items, ...planData } = data;

      return await this.prisma.mealPlan.create({
        data: {
          ...planData,
          createdBy,
          items: items?.length
            ? {
                create: items.map((item) => ({
                  name: item.name,
                  description: item.description,
                  createdBy,
                })),
              }
            : undefined,
        },
        include: { items: true },
      });
    } catch (error) {
      console.error('Error creating meal plan in repository:', error);
      throw error;
    }
  }

  async findAll(query: Record<string, any>): Promise<MealPlanWithItems[]> {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        hotelId,
        isActive,
        type,
        ...filters
      } = query;

      const skip = page
        ? (parseInt(page || '1') - 1) * parseInt(limit || '10')
        : 0;
      const take = limit ? parseInt(limit) : 10;

      let orderBy = undefined;
      if (sortBy) {
        orderBy = {
          [sortBy]: sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        };
      }

      const whereClause: any = { ...filters };

      if (hotelId) {
        whereClause.hotelId = hotelId;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true' || isActive === true;
      }

      if (type) {
        whereClause.type = type;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      return await this.prisma.mealPlan.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
        include: { items: true },
      });
    } catch (error) {
      console.error('Error finding all meal plans in repository:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<MealPlanWithItems | null> {
    try {
      return await this.prisma.mealPlan.findUnique({
        where: { id },
        include: { items: true },
      });
    } catch (error) {
      console.error(`Error finding meal plan with id ${id} in repository:`, error);
      throw error;
    }
  }

  async update(id: string, data: UpdateMealPlanDto, updatedBy?: string): Promise<MealPlanWithItems> {
    try {
      return await this.prisma.mealPlan.update({
        where: { id },
        data: {
          ...data,
          updatedBy,
        },
        include: { items: true },
      });
    } catch (error) {
      console.error(`Error updating meal plan with id ${id} in repository:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.mealPlan.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error removing meal plan with id ${id} in repository:`, error);
      throw error;
    }
  }

  async addItem(mealPlanId: string, data: CreateMealItemDto, createdBy?: string): Promise<MealItem> {
    try {
      return await this.prisma.mealItem.create({
        data: {
          ...data,
          mealPlanId,
          createdBy,
        },
      });
    } catch (error) {
      console.error(`Error adding item to meal plan ${mealPlanId} in repository:`, error);
      throw error;
    }
  }

  async updateItem(itemId: string, data: UpdateMealItemDto, updatedBy?: string): Promise<MealItem> {
    try {
      return await this.prisma.mealItem.update({
        where: { id: itemId },
        data: {
          ...data,
          updatedBy,
        },
      });
    } catch (error) {
      console.error(`Error updating meal item with id ${itemId} in repository:`, error);
      throw error;
    }
  }

  async removeItem(itemId: string): Promise<void> {
    try {
      await this.prisma.mealItem.delete({
        where: { id: itemId },
      });
    } catch (error) {
      console.error(`Error removing meal item with id ${itemId} in repository:`, error);
      throw error;
    }
  }
}

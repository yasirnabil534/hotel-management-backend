import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MealItem } from '@prisma/client';
import {
  CreateMealItemDto,
  CreateMealPlanDto,
  UpdateMealItemDto,
  UpdateMealPlanDto,
} from './meal-plan.dto';
import { IMealPlanRepository, IMealPlanService, MealPlanWithItems } from './meal-plan.interface';

@Injectable()
export class MealPlanService implements IMealPlanService {
  constructor(
    @Inject('IMealPlanRepository')
    private mealPlanRepository: IMealPlanRepository,
  ) {}

  async create(data: CreateMealPlanDto, createdBy?: string): Promise<MealPlanWithItems> {
    try {
      return await this.mealPlanRepository.create(data, createdBy);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<MealPlanWithItems[]> {
    try {
      return await this.mealPlanRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all meal plans:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<MealPlanWithItems> {
    try {
      const mealPlan = await this.mealPlanRepository.findOne(id);
      if (!mealPlan) {
        throw new NotFoundException(`Meal plan with ID ${id} not found`);
      }
      return mealPlan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error finding meal plan with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, data: UpdateMealPlanDto, updatedBy?: string): Promise<MealPlanWithItems> {
    try {
      // Ensure the meal plan exists
      await this.findOne(id);

      return await this.mealPlanRepository.update(id, data, updatedBy);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Meal plan with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Ensure the meal plan exists
      await this.findOne(id);

      await this.mealPlanRepository.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Meal plan with ID ${id} not found`);
      }
      throw error;
    }
  }

  async addItem(mealPlanId: string, data: CreateMealItemDto, createdBy?: string): Promise<MealItem> {
    try {
      // Ensure the meal plan exists
      await this.findOne(mealPlanId);

      return await this.mealPlanRepository.addItem(mealPlanId, data, createdBy);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error adding item to meal plan ${mealPlanId}:`, error);
      throw error;
    }
  }

  async updateItem(mealPlanId: string, itemId: string, data: UpdateMealItemDto, updatedBy?: string): Promise<MealItem> {
    try {
      // Ensure the meal plan exists
      await this.findOne(mealPlanId);

      return await this.mealPlanRepository.updateItem(itemId, data, updatedBy);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Meal item with ID ${itemId} not found`);
      }
      throw error;
    }
  }

  async removeItem(mealPlanId: string, itemId: string): Promise<void> {
    try {
      // Ensure the meal plan exists
      await this.findOne(mealPlanId);

      await this.mealPlanRepository.removeItem(itemId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Meal item with ID ${itemId} not found`);
      }
      throw error;
    }
  }
}

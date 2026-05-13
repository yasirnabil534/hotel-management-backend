import { MealItem, MealPlan } from '@prisma/client';
import {
  CreateMealItemDto,
  CreateMealPlanDto,
  UpdateMealItemDto,
  UpdateMealPlanDto,
} from './meal-plan.dto';

export type MealPlanWithItems = MealPlan & { items: MealItem[] };

export interface IMealPlanRepository {
  create(data: CreateMealPlanDto, createdBy?: string): Promise<MealPlanWithItems>;
  findAll(query: Record<string, any>): Promise<MealPlanWithItems[]>;
  findOne(id: string): Promise<MealPlanWithItems | null>;
  update(id: string, data: UpdateMealPlanDto, updatedBy?: string): Promise<MealPlanWithItems>;
  remove(id: string): Promise<void>;
  addItem(mealPlanId: string, data: CreateMealItemDto, createdBy?: string): Promise<MealItem>;
  updateItem(itemId: string, data: UpdateMealItemDto, updatedBy?: string): Promise<MealItem>;
  removeItem(itemId: string): Promise<void>;
}

export interface IMealPlanService {
  create(data: CreateMealPlanDto, createdBy?: string): Promise<MealPlanWithItems>;
  findAll(query?: Record<string, any>): Promise<MealPlanWithItems[]>;
  findOne(id: string): Promise<MealPlanWithItems>;
  update(id: string, data: UpdateMealPlanDto, updatedBy?: string): Promise<MealPlanWithItems>;
  remove(id: string): Promise<void>;
  addItem(mealPlanId: string, data: CreateMealItemDto, createdBy?: string): Promise<MealItem>;
  updateItem(mealPlanId: string, itemId: string, data: UpdateMealItemDto, updatedBy?: string): Promise<MealItem>;
  removeItem(mealPlanId: string, itemId: string): Promise<void>;
}

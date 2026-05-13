import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MealPlanController } from './meal-plan.controller';
import { MealPlanRepository } from './meal-plan.repository';
import { MealPlanService } from './meal-plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [MealPlanController],
  providers: [
    MealPlanService,
    MealPlanRepository,
    {
      provide: 'IMealPlanService',
      useClass: MealPlanService,
    },
    {
      provide: 'IMealPlanRepository',
      useClass: MealPlanRepository,
    },
  ],
  exports: ['IMealPlanService', 'IMealPlanRepository'],
})
export class MealPlanModule {}

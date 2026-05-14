import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryProcessorInterceptor } from '../common/query-processor.interceptor';
import {
  CreateMealItemDto,
  CreateMealPlanDto,
  UpdateMealItemDto,
  UpdateMealPlanDto,
} from './meal-plan.dto';
import { MealItemEntity, MealPlanEntity } from './meal-plan.entity';
import { IMealPlanService } from './meal-plan.interface';

@ApiTags('Meal Plan APIs')
@ApiBearerAuth()
@Controller('/meal-plans')
export class MealPlanController {
  private readonly logger = new Logger(MealPlanController.name);

  constructor(
    @Inject('IMealPlanService')
    private readonly mealPlanService: IMealPlanService,
  ) {}

  @ApiOperation({ summary: 'Create a new meal plan with optional items' })
  @ApiResponse({
    status: 201,
    description: 'Meal plan created successfully',
    type: MealPlanEntity,
  })
  @ApiBody({ type: CreateMealPlanDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMealPlanDto: CreateMealPlanDto,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const mealPlan = await this.mealPlanService.create(
        createMealPlanDto,
        req.user.userId,
      );
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: mealPlan,
      });
    } catch (error) {
      this.logger.error(`Error creating meal plan: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({
    summary: 'Get all meal plans',
    description: 'Filterable by: hotelId, isActive, type, search',
  })
  @ApiQuery({ name: 'hotelId', required: false, type: String, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by type (package, buffet)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or description' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({
    status: 200,
    description: 'Returns all meal plans',
    type: [MealPlanEntity],
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get()
  async findAll(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const mealPlans = await this.mealPlanService.findAll(req.processedQuery);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: mealPlans,
      });
    } catch (error) {
      this.logger.error(`Error fetching meal plans: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get a single meal plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a meal plan with its items',
    type: MealPlanEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const mealPlan = await this.mealPlanService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: mealPlan,
      });
    } catch (error) {
      this.logger.error(`Error fetching meal plan: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Update a meal plan' })
  @ApiResponse({
    status: 200,
    description: 'Meal plan updated successfully',
    type: MealPlanEntity,
  })
  @ApiBody({ type: UpdateMealPlanDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMealPlanDto: UpdateMealPlanDto,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const mealPlan = await this.mealPlanService.update(
        id,
        updateMealPlanDto,
        req.user.userId,
      );
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: mealPlan,
      });
    } catch (error) {
      this.logger.error(`Error updating meal plan: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Delete a meal plan' })
  @ApiResponse({
    status: 200,
    description: 'Meal plan deleted successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      await this.mealPlanService.remove(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: null,
      });
    } catch (error) {
      this.logger.error(`Error deleting meal plan: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  // --- Meal Item Endpoints ---

  @ApiOperation({ summary: 'Add an item to a meal plan' })
  @ApiResponse({
    status: 201,
    description: 'Item added successfully',
    type: MealItemEntity,
  })
  @ApiBody({ type: CreateMealItemDto })
  @UseGuards(JwtAuthGuard)
  @Post(':id/items')
  async addItem(
    @Param('id') id: string,
    @Body() createMealItemDto: CreateMealItemDto,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const item = await this.mealPlanService.addItem(
        id,
        createMealItemDto,
        req.user.userId,
      );
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: item,
      });
    } catch (error) {
      this.logger.error(`Error adding meal item: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Update a meal item' })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
    type: MealItemEntity,
  })
  @ApiBody({ type: UpdateMealItemDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/items/:itemId')
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateMealItemDto: UpdateMealItemDto,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const item = await this.mealPlanService.updateItem(
        id,
        itemId,
        updateMealItemDto,
        req.user.userId,
      );
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: item,
      });
    } catch (error) {
      this.logger.error(`Error updating meal item: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Remove a meal item' })
  @ApiResponse({
    status: 200,
    description: 'Item removed successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id/items/:itemId')
  async removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.mealPlanService.removeItem(id, itemId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: null,
      });
    } catch (error) {
      this.logger.error(`Error removing meal item: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

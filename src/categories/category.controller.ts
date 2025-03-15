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
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';
import { ICategoryService } from './category.interface';

@ApiTags('Category APIs')
@Controller('/categories')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const category = await this.categoryService.create(createCategoryDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: category,
      });
    } catch (error) {
      this.logger.error(
        `Error creating category: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: [Category],
  })
  async findAll(@Res() reply: FastifyReply): Promise<void> {
    try {
      const categories = await this.categoryService.findAll();
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: categories,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all categories: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the category.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const category = await this.categoryService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: category,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching category with id ${id}: ${error.message}`,
        error.stack,
      );
      reply.code(404).send({
        statusCode: 404,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/hotel/:hotelId')
  @ApiOperation({ summary: 'Get all categories by hotel id' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories for the hotel.',
    type: [Category],
  })
  async findByHotel(
    @Param('hotelId') hotelId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const categories = await this.categoryService.findByHotel(hotelId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: categories,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching categories for hotel ${hotelId}: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/service/:serviceId')
  @ApiOperation({ summary: 'Get all categories by service id' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories for the service.',
    type: [Category],
  })
  async findByService(
    @Param('serviceId') serviceId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const categories = await this.categoryService.findByService(serviceId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: categories,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching categories for service ${serviceId}: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const category = await this.categoryService.update(id, updateCategoryDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: category,
      });
    } catch (error) {
      this.logger.error(
        `Error updating category with id ${id}: ${error.message}`,
        error.stack,
      );
      reply.code(404).send({
        statusCode: 404,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.categoryService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: 'Category deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting category with id ${id}: ${error.message}`,
        error.stack,
      );
      reply.code(404).send({
        statusCode: 404,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

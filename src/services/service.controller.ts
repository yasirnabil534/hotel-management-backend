import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { Service } from './service.entity';
import { IServiceService } from './service.interface';
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';

@ApiTags('Services APIs')
@Controller('/services')
export class ServicesController {
  private readonly logger = new Logger(ServicesController.name);

  constructor(
    @Inject('IServiceService')
    private readonly servicesService: IServiceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 201,
    description: 'The service has been successfully created.',
    type: Service,
  })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.servicesService.create(createServiceDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error creating service: ${error.message}`,
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering categories',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (ascending or descending)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: [Service],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Return all services.',
    type: [Service],
  })
  async findAll(@Res() reply: FastifyReply): Promise<void> {
    try {
      const services = await this.servicesService.findAll();
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: services,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all services: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/hotel/:hotelId')
  @ApiOperation({ summary: 'Get all services for a specific hotel' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for the hotel.',
    type: [Service],
  })
  async findByHotel(
    @Param('hotelId') hotelId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const services = await this.servicesService.findByHotel(hotelId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: services,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching services for hotel ${hotelId}: ${error.message}`,
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
  @ApiOperation({ summary: 'Get a service by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the service.',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.servicesService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching service with id ${id}: ${error.message}`,
        error.stack,
      );
      reply.code(404).send({
        statusCode: 404,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully updated.',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.servicesService.update(id, updateServiceDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error updating service with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.servicesService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: 'Service deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting service with id ${id}: ${error.message}`,
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

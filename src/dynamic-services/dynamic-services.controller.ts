import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  CreateSystemServiceDto,
  UpdateSystemServiceDto,
} from './dynamic-services.dto';
import { ISystemServiceService } from './dynamic-services.interface';
import { Logger } from '@nestjs/common';
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';
import { SystemService } from './dynamic-services.entity';

@ApiTags('Dynamic Services APIs')
@Controller('/dynamic-services')
export class DynamicServicesController {
  private readonly logger = new Logger(DynamicServicesController.name);

  constructor(
    @Inject('ISystemServiceService')
    private readonly systemServiceService: ISystemServiceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new system service' })
  @ApiResponse({
    status: 201,
    description: 'The system service has been successfully created.',
  })
  async create(
    @Body() createSystemServiceDto: CreateSystemServiceDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.systemServiceService.create(
        createSystemServiceDto,
      );
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error creating system service: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all system services' })
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
    description: 'Search term for filtering services',
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
    description: 'Return all system services.',
    type: [SystemService],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(
    @Query() query: Record<string, any>,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const services = await this.systemServiceService.findAll(query);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: services,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching system services: ${error.message}`,
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
  @ApiOperation({ summary: 'Get a system service by id' })
  @ApiResponse({ status: 200, description: 'Return the system service.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.systemServiceService.findOne(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching system service: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/hotel/:hotelId')
  @ApiOperation({ summary: 'Get all system services for a hotel' })
  @ApiResponse({
    status: 200,
    description: 'Return the hotel system services.',
  })
  async findByHotel(
    @Param('hotelId') hotelId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const services = await this.systemServiceService.findByHotel(hotelId);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: services,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching hotel system services: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a system service' })
  @ApiResponse({
    status: 200,
    description: 'The system service has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSystemServiceDto: UpdateSystemServiceDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.systemServiceService.update(
        id,
        updateSystemServiceDto,
      );
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error updating system service: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a system service' })
  @ApiResponse({
    status: 200,
    description: 'The system service has been successfully deleted.',
  })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.systemServiceService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: null,
      });
    } catch (error) {
      this.logger.error(
        `Error deleting system service: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Put('/change-status/:id')
  @ApiOperation({ summary: 'Change the status of a system service' })
  @ApiResponse({
    status: 200,
    description: 'The system service status has been successfully changed.',
  })
  async changeStatus(
    @Param('id') id: string,
    @Body() body: { status: boolean },
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const service = await this.systemServiceService.changeStatus(
        id,
        body.status,
      );
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: service,
      });
    } catch (error) {
      this.logger.error(
        `Error changing system service status: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      })
    }
  }

  @Get('/inactive-services')
  @ApiOperation({ summary: 'Get all inactive system services' })
  @ApiResponse({
    status: 200,
    description: 'Return all inactive system services.',
  })
  async findInactiveServices(
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const services = await this.systemServiceService.findInactiveServices();
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: services,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching inactive system services: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      })
    }
  }
}

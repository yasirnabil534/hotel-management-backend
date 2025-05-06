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
  CreateServiceTemplateDto,
  UpdateServiceTemplateDto,
} from './service-template.dto';
import { IServiceTemplateService } from './service-template.interface';
import { Logger } from '@nestjs/common';
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';
import { ServiceTemplate } from './service-template.entity';

@ApiTags('Service Templates APIs')
@Controller('/service-templates')
export class ServiceTemplateController {
  private readonly logger = new Logger(ServiceTemplateController.name);

  constructor(
    @Inject('IServiceTemplateService')
    private readonly serviceTemplateService: IServiceTemplateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service template' })
  @ApiResponse({
    status: 201,
    description: 'The service template has been successfully created.',
  })
  async create(
    @Body() createServiceTemplateDto: CreateServiceTemplateDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const template = await this.serviceTemplateService.create(
        createServiceTemplateDto,
      );
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: template,
      });
    } catch (error) {
      this.logger.error(
        `Error creating service template: ${error.message}`,
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
  @ApiOperation({ summary: 'Get all service templates' })
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
    type: [ServiceTemplate],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(
    @Query() query: Record<string, any>,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const templates = await this.serviceTemplateService.findAll(query);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: templates,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching service templates: ${error.message}`,
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
  @ApiOperation({ summary: 'Get a service template by id' })
  @ApiResponse({ status: 200, description: 'Return the service template.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const template = await this.serviceTemplateService.findOne(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: template,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching service template: ${error.message}`,
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
  @ApiOperation({ summary: 'Update a service template' })
  @ApiResponse({
    status: 200,
    description: 'The service template has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceTemplateDto: UpdateServiceTemplateDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const template = await this.serviceTemplateService.update(
        id,
        updateServiceTemplateDto,
      );
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: template,
      });
    } catch (error) {
      this.logger.error(
        `Error updating service template: ${error.message}`,
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
  @ApiOperation({ summary: 'Delete a service template' })
  @ApiResponse({
    status: 200,
    description: 'The service template has been successfully deleted.',
  })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.serviceTemplateService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        message: 'Service template deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting service template: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete, Query, Res, Inject, UseInterceptors } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { IOrderService } from './order.interface';
import { Logger } from '@nestjs/common';
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';

@ApiTags('Orders API')
@Controller('/orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const order = await this.orderService.create(createOrderDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
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
    description: 'Search term for filtering orders',
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
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(@Query() query: Record<string, any>, @Res() reply: FastifyReply): Promise<void> {
    try {
      const orders = await this.orderService.findAll(query);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(`Error fetching orders: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get an order by id' })
  async findOne(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const order = await this.orderService.findOne(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(`Error fetching order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an order' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const order = await this.orderService.update(id, updateOrderDto);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(`Error updating order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an order' })
  async remove(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      await this.orderService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
      });
    } catch (error) {
      this.logger.error(`Error deleting order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}
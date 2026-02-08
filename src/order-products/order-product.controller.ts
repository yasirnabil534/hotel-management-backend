import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, Query, Res, Logger, UseInterceptors } from '@nestjs/common';
import { IOrderProductService } from './order-product.interface';
import { CreateOrderProductDto, UpdateOrderProductDto } from './order-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FastifyReply } from 'fastify';
import { QueryProcessorInterceptor } from '../common/query-processor.interceptor';

@ApiTags('Order Products API')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('/order-products')
export class OrderProductController {
  private readonly logger = new Logger(OrderProductController.name);

  constructor(
    @Inject('IOrderProductService')
    private readonly orderProductService: IOrderProductService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order product' })
  create(@Body() createOrderProductDto: CreateOrderProductDto) {
    return this.orderProductService.create(createOrderProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order products', description: 'Filterable by: hotelId, orderId, productId' })
  @ApiQuery({ name: 'hotelId', required: false, type: String, description: 'Filter by hotel ID (ObjectId) - filters via order relation' })
  @ApiQuery({ name: 'orderId', required: false, type: String, description: 'Filter by order ID (ObjectId)' })
  @ApiQuery({ name: 'productId', required: false, type: String, description: 'Filter by product ID (ObjectId)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all order products.' })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(
    @Query() query: Record<string, any>,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orderProducts = await this.orderProductService.findAll(query);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orderProducts,
      });
    } catch (error) {
      this.logger.error(`Error fetching order products: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get an order product by id' })
  findOne(@Param('id') id: string) {
    return this.orderProductService.findOne(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update an order product' })
  update(@Param('id') id: string, @Body() updateOrderProductDto: UpdateOrderProductDto) {
    return this.orderProductService.update(id, updateOrderProductDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an order product' })
  remove(@Param('id') id: string) {
    return this.orderProductService.remove(id);
  }
}
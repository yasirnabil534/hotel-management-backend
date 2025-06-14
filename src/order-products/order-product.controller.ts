import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { IOrderProductService } from './order-product.interface';
import { CreateOrderProductDto, UpdateOrderProductDto } from './order-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Order Products API')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('/order-products')
export class OrderProductController {
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
  @ApiOperation({ summary: 'Get all order products' })
  findAll() {
    return this.orderProductService.findAll();
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
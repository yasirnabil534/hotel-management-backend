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
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { IProductService } from './product.interface';
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';

@ApiTags('Product APIs')
@Controller('/products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const product = await this.productService.create(createProductDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: product,
      });
    } catch (error) {
      this.logger.error(
        `Error creating product: ${error.message}`,
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
    type: [Product],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [Product],
  })
  async findAll(@Res() reply: FastifyReply): Promise<void> {
    try {
      const products = await this.productService.findAll();
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: products,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all products: ${error.message}`,
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
  @ApiOperation({ summary: 'Get all products for a specific service' })
  @ApiResponse({
    status: 200,
    description: 'Return all products for the service.',
    type: [Product],
  })
  async findByService(
    @Param('serviceId') serviceId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const products = await this.productService.findByService(serviceId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: products,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching products for service ${serviceId}: ${error.message}`,
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
  @ApiOperation({ summary: 'Get all products for a specific hotel' })
  @ApiResponse({
    status: 200,
    description: 'Return all products for the hotel.',
    type: [Product],
  })
  async findByHotel(
    @Param('hotelId') hotelId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const products = await this.productService.findByHotel(hotelId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: products,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching products for hotel ${hotelId}: ${error.message}`,
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
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the product.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const product = await this.productService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: product,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching product with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const product = await this.productService.update(id, updateProductDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: product,
      });
    } catch (error) {
      this.logger.error(
        `Error updating product with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      await this.productService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: 'Product deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting product with id ${id}: ${error.message}`,
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

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
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { IHotelService } from './hotel.interface';
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';
import { Hotel } from './hotel.entity';

@ApiTags('Hotel APIs')
@Controller('/hotels')
export class HotelController {
  private readonly logger = new Logger(HotelController.name);

  constructor(
    @Inject('IHotelService')
    private readonly hotelService: IHotelService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiResponse({
    status: 201,
    description: 'The hotel has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createHotelDto: CreateHotelDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotel = await this.hotelService.create(createHotelDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: hotel,
      });
    } catch (error) {
      this.logger.error(`Error creating hotel: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all hotels' })
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
    type: [Hotel],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotels = await this.hotelService.findAll(req.query);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: hotels,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all hotels: ${error.message}`,
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
  @ApiOperation({ summary: 'Get a hotel by id' })
  @ApiResponse({ status: 200, description: 'Return the hotel.' })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotel = await this.hotelService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: hotel,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching hotel with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Update a hotel' })
  @ApiResponse({
    status: 200,
    description: 'The hotel has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotel = await this.hotelService.update(id, updateHotelDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: hotel,
      });
    } catch (error) {
      this.logger.error(
        `Error updating hotel with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Delete a hotel' })
  @ApiResponse({
    status: 200,
    description: 'The hotel has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.hotelService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: 'Hotel deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting hotel with id ${id}: ${error.message}`,
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

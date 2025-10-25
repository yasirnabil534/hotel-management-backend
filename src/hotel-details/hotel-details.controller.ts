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
import { QueryProcessorInterceptor } from 'src/common/query-processor.interceptor';
import { CreateHotelDetailsDto, UpdateHotelDetailsDto } from './hotel-details.dto';
import { HotelDetails } from './hotel-details.entity';
import { IHotelDetailsService } from './hotel-details.interface';

@ApiTags('Hotel Details APIs')
@Controller('/hotel-details')
export class HotelDetailsController {
  private readonly logger = new Logger(HotelDetailsController.name);

  constructor(
    @Inject('IHotelDetailsService')
    private readonly hotelDetailsService: IHotelDetailsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new hotel details' })
  @ApiResponse({
    status: 201,
    description: 'The hotel details have been successfully created.',
    type: HotelDetails,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createHotelDetailsDto: CreateHotelDetailsDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotelDetails = await this.hotelDetailsService.create(createHotelDetailsDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: hotelDetails,
      });
    } catch (error) {
      this.logger.error(`Error creating hotel details: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all hotel details' })
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
    description: 'Search term for filtering hotel details',
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
    description: 'Return all hotel details.',
    type: [HotelDetails],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotelDetails = await this.hotelDetailsService.findAll(req.query);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: hotelDetails,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all hotel details: ${error.message}`,
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
  @ApiOperation({ summary: 'Get hotel details by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the hotel details.', 
    type: HotelDetails 
  })
  @ApiResponse({ status: 404, description: 'Hotel details not found.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotelDetails = await this.hotelDetailsService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: hotelDetails,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching hotel details with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Update hotel details' })
  @ApiResponse({
    status: 200,
    description: 'The hotel details have been successfully updated.',
    type: HotelDetails,
  })
  @ApiResponse({ status: 404, description: 'Hotel details not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async update(
    @Param('id') id: string,
    @Body() updateHotelDetailsDto: UpdateHotelDetailsDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const hotelDetails = await this.hotelDetailsService.update(id, updateHotelDetailsDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: hotelDetails,
      });
    } catch (error) {
      this.logger.error(
        `Error updating hotel details with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Delete hotel details' })
  @ApiResponse({
    status: 200,
    description: 'The hotel details have been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Hotel details not found.' })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.hotelDetailsService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: 'Hotel details deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting hotel details with id ${id}: ${error.message}`,
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


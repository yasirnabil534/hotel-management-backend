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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CreateHotelDto, UpdateHotelDto } from './hotel.dto';
import { IHotelService } from './hotel.interface';

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
  @ApiResponse({ status: 200, description: 'Return all hotels.' })
  async findAll(@Res() reply: FastifyReply): Promise<void> {
    try {
      const hotels = await this.hotelService.findAll();
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

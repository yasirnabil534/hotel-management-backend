import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryProcessorInterceptor } from '../common/query-processor.interceptor';
import { AddPaymentDto, CreateRoomBookingDto, UpdateRoomBookingDto } from './room-booking.dto';
import { RoomBookingEntity } from './room-booking.entity';
import { IRoomBookingService } from './room-booking.interface';

@ApiTags('Room Booking APIs')
@ApiBearerAuth()
@Controller('/room-bookings')
export class RoomBookingController {
  private readonly logger = new Logger(RoomBookingController.name);

  constructor(
    @Inject('IRoomBookingService')
    private readonly roomBookingService: IRoomBookingService,
  ) {}

  @ApiOperation({ summary: 'Create a new room booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: RoomBookingEntity,
  })
  @ApiBody({ type: CreateRoomBookingDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRoomBookingDto: CreateRoomBookingDto,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const booking = await this.roomBookingService.create(
        createRoomBookingDto,
        req.user.userId,
      );
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: booking,
      });
    } catch (error) {
      this.logger.error(`Error creating room booking: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ 
    summary: 'Get all room bookings',
    description: 'Filterable by: roomId, userId, hotelId, status, phone, email, checkInFrom, checkInTo, checkOutFrom, checkOutTo'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all room bookings',
    type: [RoomBookingEntity],
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get()
  async findAll(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const bookings = await this.roomBookingService.findAll(req.processedQuery);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: bookings,
      });
    } catch (error) {
      this.logger.error(`Error fetching room bookings: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get a single room booking by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a room booking',
    type: RoomBookingEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const booking = await this.roomBookingService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: booking,
      });
    } catch (error) {
      this.logger.error(`Error fetching room booking: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all bookings for a specific room' })
  @ApiResponse({
    status: 200,
    description: 'Returns all bookings for the room',
    type: [RoomBookingEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get('room/:roomId')
  async findByRoomId(@Param('roomId') roomId: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const bookings = await this.roomBookingService.findByRoomId(roomId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: bookings,
      });
    } catch (error) {
      this.logger.error(`Error fetching bookings by room: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all bookings for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all bookings for the user',
    type: [RoomBookingEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const bookings = await this.roomBookingService.findByUserId(userId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: bookings,
      });
    } catch (error) {
      this.logger.error(`Error fetching bookings by user: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Update a room booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: RoomBookingEntity,
  })
  @ApiBody({ type: UpdateRoomBookingDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomBookingDto: UpdateRoomBookingDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const booking = await this.roomBookingService.update(id, updateRoomBookingDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: booking,
      });
    } catch (error) {
      this.logger.error(`Error updating room booking: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Add payment to a booking' })
  @ApiResponse({
    status: 200,
    description: 'Payment added successfully',
    type: RoomBookingEntity,
  })
  @ApiBody({ type: AddPaymentDto })
  @UseGuards(JwtAuthGuard)
  @Post(':id/payment')
  async addPayment(
    @Param('id') id: string,
    @Body() addPaymentDto: AddPaymentDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const booking = await this.roomBookingService.addPayment(id, addPaymentDto.amount);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: booking,
      });
    } catch (error) {
      this.logger.error(`Error adding payment: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Delete a room booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking deleted successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      await this.roomBookingService.remove(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: null,
      });
    } catch (error) {
      this.logger.error(`Error deleting room booking: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

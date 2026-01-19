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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryProcessorInterceptor } from '../common/query-processor.interceptor';
import { GenerateRoomQRDto, RoomQRResponseDto } from './room-qr.dto';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';
import { RoomEntity } from './room.entity';
import { IRoomService } from './room.interface';

@ApiTags('Room APIs')
@ApiBearerAuth()
@Controller('/rooms')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);

  constructor(
    @Inject('IRoomService')
    private readonly roomsService: IRoomService,
  ) {}

  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomEntity,
  })
  @ApiBody({ type: CreateRoomDto })
  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const room = await this.roomsService.create(createRoomDto);
      const { password, ...roomWithoutPassword } = room;
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: roomWithoutPassword,
      });
    } catch (error) {
      this.logger.error(`Error creating room: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all rooms with filters', description: 'Filterable by: hotelId, status, search (name/roomCode)' })
  @ApiResponse({
    status: 200,
    description: 'Returns all rooms',
    type: [RoomEntity],
  })
  @ApiQuery({ name: 'hotelId', required: false, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by room status', enum: ['available', 'booked', 'unavailable'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search by room name or code' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', enum: ['asc', 'desc'], example: 'asc' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get()
  async findAll(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const rooms = await this.roomsService.findAll(req.processedQuery);
      const roomsWithoutPassword = rooms.map(({ password, ...room }) => room);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: roomsWithoutPassword,
      });
    } catch (error) {
      this.logger.error(`Error fetching rooms: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get a single room by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a room',
    type: RoomEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const room = await this.roomsService.findOne(id);
      const { password, ...roomWithoutPassword } = room;
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: roomWithoutPassword,
      });
    } catch (error) {
      this.logger.error(`Error fetching room: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Update a room' })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomEntity,
  })
  @ApiBody({ type: UpdateRoomDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const room = await this.roomsService.update(id, updateRoomDto);
      const { password, ...roomWithoutPassword } = room;
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: roomWithoutPassword,
      });
    } catch (error) {
      this.logger.error(`Error updating room: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      await this.roomsService.remove(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: null,
      });
    } catch (error) {
      this.logger.error(`Error deleting room: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Generate QR code for room login' })
  @ApiResponse({
    status: 200,
    description: 'QR code generated successfully',
    type: RoomQRResponseDto,
  })
  @ApiBody({ type: GenerateRoomQRDto })
  @UseGuards(JwtAuthGuard)
  @Post('generate-qr')
  async generateQR(
    @Body() generateRoomQRDto: GenerateRoomQRDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const result = await this.roomsService.generateRoomQRCode(
        generateRoomQRDto.roomId,
        generateRoomQRDto.password,
      );
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      this.logger.error(`Error generating QR code: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

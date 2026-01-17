import {
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryProcessorInterceptor } from '../common/query-processor.interceptor';
import { RoomSessionEntity } from '../rooms/room.entity';
import { IRoomSessionService } from './room-session.interface';

@ApiTags('Room Session APIs')
@ApiBearerAuth()
@Controller('/room-sessions')
export class RoomSessionController {
  private readonly logger = new Logger(RoomSessionController.name);

  constructor(
    @Inject('IRoomSessionService')
    private readonly roomSessionService: IRoomSessionService,
  ) {}

  @ApiOperation({ 
    summary: 'Get all room sessions with filters',
    description: 'Filterable by: roomId, hotelId, status, createdAt range'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all room sessions (filterable by roomId, hotelId, status, created date range)',
    type: [RoomSessionEntity],
  })
  @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
  @ApiQuery({ name: 'hotelId', required: false, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by session status (pending, active, paused, ended)' })
  @ApiQuery({ name: 'createdAtFrom', required: false, description: 'Filter sessions created on or after this date (yyyy-mm-dd)' })
  @ApiQuery({ name: 'createdAtTo', required: false, description: 'Filter sessions created on or before this date (yyyy-mm-dd)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)', enum: ['asc', 'desc'], example: 'desc' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get()
  async findAll(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const sessions = await this.roomSessionService.findAll(req.processedQuery);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: sessions,
      });
    } catch (error) {
      this.logger.error(`Error fetching room sessions: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get a single room session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a room session',
    type: RoomSessionEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    try {
      const session = await this.roomSessionService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: session,
      });
    } catch (error) {
      this.logger.error(`Error fetching room session: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all pending session requests' })
  @ApiResponse({
    status: 200,
    description: 'Returns all pending session requests',
    type: [RoomSessionEntity],
  })
  @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
  @ApiQuery({ name: 'hotelId', required: false, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get('status/pending')
  async getPendingSessions(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const sessions = await this.roomSessionService.getPendingSessions(req.processedQuery);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: sessions,
      });
    } catch (error) {
      this.logger.error(`Error fetching pending sessions: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all active sessions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all active sessions',
    type: [RoomSessionEntity],
  })
  @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
  @ApiQuery({ name: 'hotelId', required: false, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'createdAtFrom', required: false, description: 'Filter sessions created on or after this date (yyyy-mm-dd)' })
  @ApiQuery({ name: 'createdAtTo', required: false, description: 'Filter sessions created on or before this date (yyyy-mm-dd)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get('status/active')
  async getActiveSessions(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const sessions = await this.roomSessionService.getActiveSessions(req.processedQuery);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: sessions,
      });
    } catch (error) {
      this.logger.error(`Error fetching active sessions: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all paused sessions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all paused sessions',
    type: [RoomSessionEntity],
  })
  @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
  @ApiQuery({ name: 'hotelId', required: false, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(QueryProcessorInterceptor)
  @Get('status/paused')
  async getPausedSessions(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const sessions = await this.roomSessionService.getPausedSessions(req.processedQuery);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: sessions,
      });
    } catch (error) {
      this.logger.error(`Error fetching paused sessions: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Start a session by approving pending request (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Session started successfully',
    type: RoomSessionEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Post(':sessionId/start')
  async startSession(
    @Param('sessionId') sessionId: string,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const session = await this.roomSessionService.startSession(sessionId, req.user.userId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: session,
      });
    } catch (error) {
      this.logger.error(`Error starting session: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Pause a room session (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Session paused successfully',
    type: RoomSessionEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Post(':sessionId/pause')
  async pauseSession(
    @Param('sessionId') sessionId: string,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const session = await this.roomSessionService.pauseSession(sessionId, req.user.userId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: session,
      });
    } catch (error) {
      this.logger.error(`Error pausing session: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Resume a paused room session (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Session resumed successfully',
    type: RoomSessionEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Post(':sessionId/resume')
  async resumeSession(
    @Param('sessionId') sessionId: string,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const session = await this.roomSessionService.resumeSession(sessionId, req.user.userId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: session,
      });
    } catch (error) {
      this.logger.error(`Error resuming session: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'End a room session (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Session ended successfully',
    type: RoomSessionEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Post(':sessionId/end')
  async endSession(
    @Param('sessionId') sessionId: string,
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const session = await this.roomSessionService.endSession(sessionId, req.user.userId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: session,
      });
    } catch (error) {
      this.logger.error(`Error ending session: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Delete a room session (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Session deleted successfully',
    type: RoomSessionEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':sessionId')
  async deleteSession(
    @Param('sessionId') sessionId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const session = await this.roomSessionService.deleteSession(sessionId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        message: 'Session deleted successfully',
        data: session,
      });
    } catch (error) {
      this.logger.error(`Error deleting session: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

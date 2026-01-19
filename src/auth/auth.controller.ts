/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { RoomTokenLoginDto } from '../rooms/room-qr.dto';
import { RoomLoginDto } from '../rooms/room.dto';
import { RoomLoginResponseDto } from '../rooms/room.entity';
import { LoginCredentialsDto, LoginResponseDto } from './auth.entity';
import { IAuthService } from './auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth APIs')
@ApiBearerAuth()
@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token',
    type: LoginResponseDto,
  })
  @ApiBody({ type: LoginCredentialsDto })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      const result = await this.authService.login(req.user);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      this.logger.error(`Error during login: ${error.message}`, error.stack);
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Login with room code' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token for room, or session pending status',
    type: RoomLoginResponseDto,
  })
  @ApiBody({ type: RoomLoginDto })
  @Post('/login/room')
  async loginRoom(@Body() roomLoginDto: RoomLoginDto, @Res() reply: FastifyReply): Promise<void> {
    try {
      const result = await this.authService.validateRoomForLogin(roomLoginDto.roomCode);
      
      // If session is pending, return 202 Accepted with pending status
      if (result.status === 'pending') {
        reply.code(202).send({
          statusCode: 202,
          statusMessage: 'Pending',
          message: result.message,
          data: {
            room: result.room,
            status: 'pending',
          },
        });
        return;
      }

      // If session is active, proceed with login
      const loginResult = await this.authService.loginRoom(result.room);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: loginResult,
      });
    } catch (error) {
      this.logger.error(`Error during room login: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Login with room token (from QR code)' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token for room, or session pending status',
    type: RoomLoginResponseDto,
  })
  @ApiBody({ type: RoomTokenLoginDto })
  @Post('/login/room-token')
  async loginRoomWithToken(@Body() roomTokenLoginDto: RoomTokenLoginDto, @Res() reply: FastifyReply): Promise<void> {
    try {
      const result = await this.authService.validateRoomWithToken(roomTokenLoginDto.token);
      
      // If session is pending, return 202 Accepted with pending status
      if (result.status === 'pending') {
        reply.code(202).send({
          statusCode: 202,
          statusMessage: 'Pending',
          message: result.message,
          data: {
            room: result.room,
            status: 'pending',
          },
        });
        return;
      }

      // If session is active, proceed with login
      const loginResult = await this.authService.loginRoom(result.room);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: loginResult,
      });
    } catch (error) {
      this.logger.error(`Error during room token login: ${error.message}`, error.stack);
      const statusCode = error.status || 500;
      reply.code(statusCode).send({
        statusCode,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get user/room profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user or room profile information',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req, @Res() reply: FastifyReply): Promise<void> {
    try {
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: req.user,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching profile: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}

/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
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

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile information',
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

/* eslint-disable prettier/prettier */
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
import { UserType } from '../utils/enums/user-type.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { IUserService } from './user.interface';

@ApiTags('Users APIs')
@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject('IUserService')
    private readonly usersService: IUserService,
  ) {}

  @Post('/super-admin')
  @ApiOperation({ summary: 'Create a new super admin user' })
  @ApiResponse({
    status: 201,
    description: 'The super admin user has been successfully created.',
    type: User,
  })
  async createSuperAdmin(
    @Body() createUser: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.create({
        ...createUser,
        type: UserType.SUPER_ADMIN,
      });
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error creating super admin user: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/admin')
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({
    status: 201,
    description: 'The admin user has been successfully created.',
    type: User,
  })
  async createAdmin(
    @Body() createUser: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.create({
        ...createUser,
        type: UserType.ADMIN,
      });
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error creating admin user: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/hotel-admin')
  @ApiOperation({ summary: 'Create a new hotel admin user' })
  @ApiResponse({
    status: 201,
    description: 'The staff user has been successfully created.',
    type: User,
  })
  async createHotelAdmin(
    @Body() createUser: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.create({
        ...createUser,
        type: UserType.HOTEL_MANAGEMENT,
      });
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error creating staff user: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/staff')
  @ApiOperation({ summary: 'Create a new staff user' })
  @ApiResponse({
    status: 201,
    description: 'The staff user has been successfully created.',
    type: User,
  })
  async createStaff(
    @Body() createUser: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.create({
        ...createUser,
        type: UserType.HOTEL_STAFF,
      });
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error creating staff user: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/customer')
  @ApiOperation({ summary: 'Create a new customer user' })
  @ApiResponse({
    status: 201,
    description: 'The customer user has been successfully created.',
    type: User,
  })
  async createCustomer(
    @Body() createUser: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.create({
        ...createUser,
        type: UserType.CUSTOMER,
      });
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error creating customer user: ${error.message}`,
        error.stack,
      );
      reply.code(500).send({
        statusCode: 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/user')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The customer user has been successfully created.',
    type: User,
  })
  async createUser(
    @Body() createUser: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.create({
        ...createUser,
        type: UserType.USER,
      });
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error creating customer user: ${error.message}`,
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
  @ApiOperation({ summary: 'Get all users' })
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
    type: [User],
  })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(@Req() req: FastifyRequest, @Res() reply: FastifyReply): Promise<void> {
    try {
      const users = await this.usersService.findAll(req.query);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: users,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all users: ${error.message}`,
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
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.findOne(id);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching user with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error updating user with id ${id}: ${error.message}`,
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
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.usersService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: 'User deleted successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error deleting user with id ${id}: ${error.message}`,
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

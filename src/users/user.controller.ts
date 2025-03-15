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
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
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

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  async findAll(@Res() reply: FastifyReply): Promise<void> {
    try {
      const users = await this.usersService.findAll();
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

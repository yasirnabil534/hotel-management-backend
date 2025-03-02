import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { IUserService } from './user.interface';
import { UserType } from '../utils/enums/user-type.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUserService')
    private readonly usersService: IUserService
  ) {}

  @Post('super-admin')
  @ApiOperation({ summary: 'Create a new super admin user' })
  @ApiResponse({
    status: 201,
    description: 'The super admin user has been successfully created.',
    type: User,
  })
  async createSuperAdmin(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.usersService.create({ ...createUser, type: UserType.SUPER_ADMIN });
  }

  @Post('admin')
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({
    status: 201,
    description: 'The admin user has been successfully created.',
    type: User,
  })
  async createAdmin(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.usersService.create({ ...createUser, type: UserType.ADMIN });
  }

  @Post('staff')
  @ApiOperation({ summary: 'Create a new staff user' })
  @ApiResponse({
    status: 201,
    description: 'The staff user has been successfully created.',
    type: User,
  })
  async createStaff(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.usersService.create({ ...createUser, type: UserType.HOTEL_MANAGEMENT });
  }

  @Post('customer')
  @ApiOperation({ summary: 'Create a new customer user' })
  @ApiResponse({
    status: 201,
    description: 'The customer user has been successfully created.',
    type: User,
  })
  async createCustomer(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.usersService.create({ ...createUser, type: UserType.CUSTOMER });
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    this.usersService.remove(id);
  }
}

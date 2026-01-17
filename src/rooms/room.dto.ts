import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room 101', description: 'The name of the room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123', description: 'The password for the room' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'vip', description: 'The category of room', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    example: 'available', 
    description: 'The status of the room', 
    enum: ['available', 'booked', 'unavailable'],
    required: false 
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The hotel ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  hotelId?: string;
}

export class UpdateRoomDto {
  @ApiProperty({ example: 'Room 101', description: 'The name of the room', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'password123', description: 'The password for the room', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'vip', description: 'The category of room', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    example: 'available', 
    description: 'The status of the room', 
    enum: ['available', 'booked', 'unavailable'],
    required: false 
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The hotel ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  hotelId?: string;
}

export class RoomLoginDto {
  @ApiProperty({
    example: 'ABCDEFGHIJKLMNOPQRSTUV',
    description: 'The 24-letter room code',
  })
  @IsString()
  roomCode: string;
}

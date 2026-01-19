import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoomSessionDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID' })
  @IsString()
  roomId: string;

  @ApiProperty({ example: 'pending', description: 'The session status', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateRoomSessionDto {
  @ApiProperty({ example: 'active', description: 'The session status', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

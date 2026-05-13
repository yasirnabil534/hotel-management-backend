import { ApiProperty } from '@nestjs/swagger';

export class RoomEntity {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID' })
  id: string;

  @ApiProperty({
    example: 'ABCDEFGHIJKLMNOPQRSTUV',
    description: 'The 24-letter room code for authentication',
  })
  roomCode: string;

  @ApiProperty({ example: 'Room 101', description: 'The name of the room' })
  name: string;

  @ApiProperty({ example: 'vip', description: 'The category of room', required: false })
  category?: string;

  @ApiProperty({ 
    example: 'available', 
    description: 'The status of the room', 
    enum: ['available', 'booked', 'unavailable']
  })
  status: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The hotel ID',
    required: false,
  })
  hotelId?: string;

  @ApiProperty({ example: 150.0, description: 'Default nightly room rate' })
  initialPrice: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}

export class RoomLoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT refresh token' })
  refresh_token: string;

  @ApiProperty({ type: RoomEntity, description: 'Room information' })
  room: Omit<RoomEntity, 'password'>;
}

export class RoomSessionEntity {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The session ID' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID' })
  roomId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The hotel ID', required: false })
  hotelId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID who created the session', required: false })
  createdBy?: string;

  @ApiProperty({ example: 'pending', description: 'The session status', enum: ['pending', 'active', 'paused', 'ended'] })
  status: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The admin user ID who accepted', required: false })
  acceptedBy?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Session start timestamp', required: false })
  startedAt?: Date;

  @ApiProperty({ example: '2024-01-01T06:00:00.000Z', description: 'Session pause timestamp', required: false })
  pausedAt?: Date;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The admin user ID who paused the session', required: false })
  pausedBy?: string;

  @ApiProperty({ example: '2024-01-01T08:00:00.000Z', description: 'Session resume timestamp', required: false })
  resumedAt?: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: 'Session end timestamp', required: false })
  endedAt?: Date;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The admin user ID who ended the session', required: false })
  endedBy?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateRoomQRDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID' })
  @IsString()
  roomId: string;

  @ApiProperty({ example: 'password123', description: 'The room password' })
  @IsString()
  password: string;
}

export class RoomQRResponseDto {
  @ApiProperty({ example: 'encrypted_token_string', description: 'Encrypted token containing room credentials' })
  token: string;

  @ApiProperty({ example: 'data:image/png;base64,...', description: 'QR code as base64 image' })
  qrCode: string;
}

export class RoomTokenLoginDto {
  @ApiProperty({ example: 'encrypted_token_string', description: 'Encrypted token from QR code' })
  @IsString()
  token: string;
}

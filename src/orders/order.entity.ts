import { ApiProperty } from '@nestjs/swagger';

export class OrderEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  hotelId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
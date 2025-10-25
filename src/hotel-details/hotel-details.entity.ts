import { ApiProperty } from '@nestjs/swagger';

export class HotelDetails {
  @ApiProperty({ description: 'The unique identifier of the hotel details' })
  id: string;

  @ApiProperty({ description: 'The logo URL of the hotel', required: false })
  logo?: string;

  @ApiProperty({ description: 'The address of the hotel' })
  address: string;

  @ApiProperty({ description: 'The email of the hotel' })
  email: string;

  @ApiProperty({ description: 'The contact number of the hotel' })
  contact: string;

  @ApiProperty({ description: 'The level of the hotel' })
  level: string;

  @ApiProperty({ description: 'The color palate configuration', required: false })
  colorPalate: any;

  @ApiProperty({ description: 'The date when the hotel details were created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the hotel details were last updated' })
  updatedAt: Date;
}


import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

export class Hotel {
  @ApiProperty({ description: 'The unique identifier of the hotel' })
  id: string;

  @ApiProperty({ description: 'The name of the hotel' })
  name: string;

  @ApiProperty({ description: 'The address of the hotel' })
  address: string;

  @ApiProperty({
    description: 'The rating of the hotel',
    minimum: 0,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({ description: 'The ID of the hotel owner' })
  ownerId: string;

  @ApiProperty({ description: 'The date when the hotel was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the hotel was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The owner of the hotel', type: () => User })
  owner: User;
}

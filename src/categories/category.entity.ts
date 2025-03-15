import { ApiProperty } from '@nestjs/swagger';
import { Hotel } from '../hotels/hotel.entity';
import { Service } from '../services/service.entity';

export class Category {
  @ApiProperty({ description: 'The unique identifier of the category' })
  id: string;

  @ApiProperty({ description: 'The name of the category' })
  name: string;

  @ApiProperty({ description: 'The ID of the service this category belongs to' })
  serviceId: string;

  @ApiProperty({ description: 'The ID of the hotel this category belongs to' })
  hotelId: string;

  @ApiProperty({ description: 'The date when the category was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the category was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The service this category belongs to', type: () => Service })
  service: Service;

  @ApiProperty({ description: 'The hotel this category belongs to', type: () => Hotel })
  hotel: Hotel;
}
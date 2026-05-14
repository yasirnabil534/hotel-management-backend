import { ApiProperty } from '@nestjs/swagger';

export class MealItemEntity {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The meal item ID' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The meal plan ID' })
  mealPlanId: string;

  @ApiProperty({ example: 'Rice', description: 'Name of the meal item' })
  name: string;

  @ApiProperty({ example: 'Steamed basmati rice', description: 'Description', required: false })
  description?: string;

  @ApiProperty({ example: true, description: 'Whether the item is active' })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}

export class MealPlanEntity {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The meal plan ID' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The hotel ID' })
  hotelId: string;

  @ApiProperty({ example: 'Breakfast Only', description: 'Name of the meal plan' })
  name: string;

  @ApiProperty({ example: 'Continental breakfast package', description: 'Description', required: false })
  description?: string;

  @ApiProperty({ example: 'package', description: 'Type of meal plan', enum: ['package', 'buffet'] })
  type: string;

  @ApiProperty({
    example: 'per_guest_per_night',
    description: 'Pricing type',
    enum: ['per_booking', 'per_night', 'per_guest', 'per_guest_per_night'],
  })
  pricingType: string;

  @ApiProperty({ example: 500, description: 'Price of the meal plan' })
  price: number;

  @ApiProperty({ example: true, description: 'Whether the meal plan is active' })
  isActive: boolean;

  @ApiProperty({ type: [MealItemEntity], description: 'Meal items included in this plan' })
  items: MealItemEntity[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}

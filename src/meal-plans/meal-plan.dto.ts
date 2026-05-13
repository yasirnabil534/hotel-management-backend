import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMealItemDto {
  @ApiProperty({ example: 'Rice', description: 'Name of the meal item' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Steamed basmati rice', description: 'Description of the meal item', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMealItemDto {
  @ApiProperty({ example: 'Rice', description: 'Name of the meal item', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Steamed basmati rice', description: 'Description of the meal item', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, description: 'Whether the item is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMealPlanDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The hotel ID' })
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 'Breakfast Only', description: 'Name of the meal plan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Continental breakfast package', description: 'Description of the meal plan', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'package', description: 'Type of meal plan', enum: ['package', 'buffet'], required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    example: 'per_guest_per_night',
    description: 'Pricing type',
    enum: ['per_booking', 'per_night', 'per_guest', 'per_guest_per_night'],
    required: false,
  })
  @IsOptional()
  @IsString()
  pricingType?: string;

  @ApiProperty({ example: 500, description: 'Price of the meal plan' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Initial meal items to include',
    type: [CreateMealItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  items?: CreateMealItemDto[];
}

export class UpdateMealPlanDto {
  @ApiProperty({ example: 'Breakfast Only', description: 'Name of the meal plan', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Continental breakfast package', description: 'Description of the meal plan', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'package', description: 'Type of meal plan', enum: ['package', 'buffet'], required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    example: 'per_guest_per_night',
    description: 'Pricing type',
    enum: ['per_booking', 'per_night', 'per_guest', 'per_guest_per_night'],
    required: false,
  })
  @IsOptional()
  @IsString()
  pricingType?: string;

  @ApiProperty({ example: 500, description: 'Price of the meal plan', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: true, description: 'Whether the meal plan is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

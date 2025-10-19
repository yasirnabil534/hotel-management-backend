import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'The ID of the product to add to cart',
    example: '507f1f77bcf86cd799439011',
    type: String
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product to add',
    example: 2,
    minimum: 1,
    type: Number
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'The new quantity for the cart item (0 to remove item)',
    example: 3,
    minimum: 0,
    type: Number
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
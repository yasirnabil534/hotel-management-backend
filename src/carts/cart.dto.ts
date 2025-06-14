import { IsNumber, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
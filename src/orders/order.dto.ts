import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { CreateOrderProductDto } from '../order-products/order-product.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  hotelId: string;

  @ApiProperty({ type: [CreateOrderProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  orderProducts: Omit<CreateOrderProductDto, 'orderId'>[];

  @ApiProperty()
  @IsString()
  status: string = 'pending';

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  total?: number;
}

export interface Order {
  id: string;
  userId: string;
  hotelId: string;
  status: string;
  hidden: boolean;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
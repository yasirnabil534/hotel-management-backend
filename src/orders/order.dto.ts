import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { CreateOrderProductDto } from '../order-products/order-product.dto';

export class CreateOrderDto {
  @ApiProperty({ required: false, description: 'User ID (for human users)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ required: false, description: 'Room ID (for room orders)' })
  @IsOptional()
  @IsString()
  roomId?: string;

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

export interface User {
  id: string;
  email: string;
  name: string;
  type: string;
  hotelId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  ownerId: string;
  hotelDetailsId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  roomCode: string;
  name: string;
  category?: string;
  status: string;
  hotelId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

export interface Order {
  id: string;
  userId?: string;
  roomId?: string;
  hotelId: string;
  status: string;
  hidden: boolean;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  hotel?: Hotel;
  room?: Room;
  OrderProduct?: OrderProduct[];
}
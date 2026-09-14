import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: [String], default: [], required: false })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;
}


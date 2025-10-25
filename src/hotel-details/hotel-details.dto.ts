import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateHotelDetailsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ description: 'Color palate configuration as JSON object' })
  @IsObject()
  @IsNotEmpty()
  colorPalate: any;
}

export class UpdateHotelDetailsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiProperty({ description: 'Color palate configuration as JSON object' })
  @IsObject()
  @IsOptional()
  colorPalate?: any;
}


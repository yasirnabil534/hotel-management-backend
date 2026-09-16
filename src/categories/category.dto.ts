import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The ID of the service this category belongs to' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ description: 'The ID of the hotel this category belongs to' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({
    required: false,
    description: 'Parent category id — omit for top-level',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ description: 'The name of the category', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description:
      'Parent category id — set to null to promote to top-level, omit to leave parent unchanged',
  })
  @IsOptional()
  @IsString()
  parentId?: string | null;
}
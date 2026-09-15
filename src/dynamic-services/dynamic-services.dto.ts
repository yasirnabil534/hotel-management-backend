import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';
import { Hotel } from 'src/hotels/hotel.entity';
import { ServiceTemplate } from 'src/service-templates/service-template.entity';

export interface SystemService {
  id: string;
  hotelId: string;
  serviceTemplateId: string;
  hotel?: Hotel;
  systemService?: ServiceTemplate;
}
export class CreateSystemServiceDto {
  name?: string;

  description?: string;

  image?: string;

  link?: string;

  @ApiProperty({ description: 'The service template ID' })
  @IsMongoId()
  hotelId: string;

  @ApiProperty({ description: 'The service template ID' })
  @IsMongoId()
  serviceTemplateId: string;
}

export class UpdateSystemServiceDto {
  @ApiProperty({ description: 'Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Image Link' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Other Link' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: 'The hotel ID', required: false })
  @IsOptional()
  @IsMongoId()
  hotelId?: string;

  @ApiProperty({ description: 'The service template ID', required: false })
  @IsOptional()
  @IsMongoId()
  serviceTemplateId?: string;
}


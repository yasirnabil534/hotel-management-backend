import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId } from 'class-validator';
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
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Image Link' })
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Other Link' })
  @IsString()
  link?: string;

  @ApiProperty({ description: 'The hotel ID', required: false })
  @IsMongoId()
  hotelId?: string;

  @ApiProperty({ description: 'The service template ID', required: false })
  @IsMongoId()
  serviceTemplateId?: string;
}

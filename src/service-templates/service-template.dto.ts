import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateServiceTemplateDto {
  @ApiProperty({ description: 'The name of the service template' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The image URL of the service template', required: false })
  @IsString()
  image?: string;

  @ApiProperty({ description: 'The description of the service template' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The link associated with the service template' })
  @IsString()
  @IsNotEmpty()
  link: string;
}

export class UpdateServiceTemplateDto {
  @ApiProperty({
    description: 'The name of the service template',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The image URL of the service template',
    required: false,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'The description of the service template',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The link associated with the service template',
    required: false,
  })
  @IsString()
  link?: string;
}


export interface ServiceTemplate {
  id: string;
  name: string;
  image?: string;
  description: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}
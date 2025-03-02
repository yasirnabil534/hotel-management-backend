import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  ownerId: string;
}

export class UpdateHotelDto extends CreateHotelDto {}
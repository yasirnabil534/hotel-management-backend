import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID' })
  @IsString()
  roomId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The user ID (optional)', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'John Doe', description: 'Guest name' })
  @IsString()
  userName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Guest email', required: false })
  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @ApiProperty({ example: '+1234567890', description: 'Guest phone', required: false })
  @IsOptional()
  @IsString()
  userPhone?: string;

  @ApiProperty({ example: '2024-01-15T14:00:00Z', description: 'Check-in date and time' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2024-01-20T11:00:00Z', description: 'Check-out date and time' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 150.00, description: 'Room price per night' })
  @IsNumber()
  @Min(0)
  roomPrice: number;

  @ApiProperty({ example: 5, description: 'Number of nights' })
  @IsNumber()
  @Min(1)
  numberOfNights: number;

  @ApiProperty({ example: 3, description: 'Total number of guests', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Meal plan ID (optional)', required: false })
  @IsOptional()
  @IsString()
  mealPlanId?: string;

  @ApiProperty({ example: 3, description: 'Number of guests for the meal plan', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  mealGuestCount?: number;

  @ApiProperty({ example: 50.00, description: 'Discount amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ example: 100.00, description: 'Amount paid', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paid?: number;

  @ApiProperty({ example: 'pending', description: 'Booking status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'Late check-in requested', description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRoomBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The user ID (optional)', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'John Doe', description: 'Guest name', required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ example: 'john@example.com', description: 'Guest email', required: false })
  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @ApiProperty({ example: '+1234567890', description: 'Guest phone', required: false })
  @IsOptional()
  @IsString()
  userPhone?: string;

  @ApiProperty({ example: '2024-01-15T14:00:00Z', description: 'Check-in date and time', required: false })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @ApiProperty({ example: '2024-01-20T11:00:00Z', description: 'Check-out date and time', required: false })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @ApiProperty({ example: 150.00, description: 'Room price per night', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  roomPrice?: number;

  @ApiProperty({ example: 5, description: 'Number of nights', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfNights?: number;

  @ApiProperty({ example: 3, description: 'Total number of guests', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Meal plan ID (optional)', required: false })
  @IsOptional()
  @IsString()
  mealPlanId?: string;

  @ApiProperty({ example: 3, description: 'Number of guests for the meal plan', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  mealGuestCount?: number;

  @ApiProperty({ example: 50.00, description: 'Discount amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ example: 100.00, description: 'Amount paid', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paid?: number;

  @ApiProperty({ example: 'confirmed', description: 'Booking status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'Late check-in requested', description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddPaymentDto {
  @ApiProperty({ example: 100.00, description: 'Payment amount' })
  @IsNumber()
  @Min(0)
  amount: number;
}

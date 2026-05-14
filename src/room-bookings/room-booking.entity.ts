import { ApiProperty } from '@nestjs/swagger';

export class RoomBookingEntity {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The booking ID' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The room ID' })
  roomId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The user ID', required: false })
  userId?: string;

  @ApiProperty({ example: 'John Doe', description: 'Guest name' })
  userName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Guest email', required: false })
  userEmail?: string;

  @ApiProperty({ example: '+1234567890', description: 'Guest phone', required: false })
  userPhone?: string;

  @ApiProperty({ example: '2024-01-15T14:00:00Z', description: 'Check-in date and time' })
  checkInDate: Date;

  @ApiProperty({ example: '2024-01-20T11:00:00Z', description: 'Check-out date and time' })
  checkOutDate: Date;

  @ApiProperty({ example: 3, description: 'Total number of guests' })
  guestCount: number;

  @ApiProperty({ example: 5, description: 'Number of nights' })
  numberOfNights: number;

  @ApiProperty({ example: 150.00, description: 'Room price per night' })
  roomPrice: number;

  @ApiProperty({ example: 750.00, description: 'Room subtotal (roomPrice × nights)' })
  roomSubtotal: number;

  // Meal plan snapshot fields
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Meal plan ID (snapshot)', required: false })
  mealPlanId?: string;

  @ApiProperty({ example: 'Dinner Buffet', description: 'Meal plan name (snapshot)', required: false })
  mealPlanName?: string;

  @ApiProperty({ example: 'buffet', description: 'Meal plan type (snapshot)', enum: ['package', 'buffet'], required: false })
  mealPlanType?: string;

  @ApiProperty({ example: 'per_guest_per_night', description: 'Meal pricing type (snapshot)', required: false })
  mealPricingType?: string;

  @ApiProperty({ example: 1500, description: 'Meal price per unit (snapshot)' })
  mealPrice: number;

  @ApiProperty({ example: 3, description: 'Number of guests for the meal plan' })
  mealGuestCount: number;

  @ApiProperty({ example: 9000, description: 'Meal subtotal' })
  mealSubtotal: number;

  @ApiProperty({
    example: [{ name: 'Rice' }, { name: 'Chicken' }, { name: 'Fish' }],
    description: 'Snapshot of meal items at booking time',
    required: false,
  })
  mealItems?: any;

  @ApiProperty({ example: 9750.00, description: 'Subtotal (roomSubtotal + mealSubtotal)' })
  subtotal: number;

  @ApiProperty({ example: 50.00, description: 'Discount amount' })
  discount: number;

  @ApiProperty({ example: 9700.00, description: 'Total amount (subtotal - discount)' })
  total: number;

  @ApiProperty({ example: 200.00, description: 'Amount paid' })
  paid: number;

  @ApiProperty({ example: 9500.00, description: 'Balance remaining (total - paid)' })
  balance: number;

  @ApiProperty({ example: 'confirmed', description: 'Booking status', enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'] })
  status: string;

  @ApiProperty({ example: 'Late check-in requested', description: 'Additional notes', required: false })
  notes?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Admin who created the booking', required: false })
  createdBy?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Admin who last updated the booking', required: false })
  updatedBy?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}

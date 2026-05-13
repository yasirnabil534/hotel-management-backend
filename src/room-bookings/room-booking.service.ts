import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoomBooking } from '@prisma/client';
import { IRoomService } from '../rooms/room.interface';
import { IMealPlanService } from '../meal-plans/meal-plan.interface';
import { CreateRoomBookingDto, UpdateRoomBookingDto } from './room-booking.dto';
import { IRoomBookingRepository, IRoomBookingService } from './room-booking.interface';

@Injectable()
export class RoomBookingService implements IRoomBookingService {
  private readonly logger = new Logger(RoomBookingService.name);

  constructor(
    @Inject('IRoomBookingRepository')
    private roomBookingRepository: IRoomBookingRepository,
    @Inject('IRoomService')
    private roomService: IRoomService,
    @Inject('IMealPlanService')
    private mealPlanService: IMealPlanService,
  ) {}

  /**
   * Calculate meal subtotal based on pricing type.
   */
  private calculateMealSubtotal(
    price: number,
    pricingType: string,
    guestCount: number,
    nights: number,
  ): number {
    switch (pricingType) {
      case 'per_booking':
        return price;
      case 'per_night':
        return price * nights;
      case 'per_guest':
        return price * guestCount;
      case 'per_guest_per_night':
        return price * guestCount * nights;
      default:
        return price * guestCount * nights;
    }
  }

  async create(createRoomBookingDto: CreateRoomBookingDto, createdBy?: string): Promise<RoomBooking> {
    try {
      // Check if the room exists and is available
      const room = await this.roomService.findOne(createRoomBookingDto.roomId);
      if (!room) {
        throw new NotFoundException(`Room with ID ${createRoomBookingDto.roomId} not found`);
      }
      if (room.status !== 'available') {
        throw new ConflictException(`Room is currently "${room.status}" and cannot be booked`);
      }

      // Validate dates
      const checkIn = new Date(createRoomBookingDto.checkInDate);
      const checkOut = new Date(createRoomBookingDto.checkOutDate);

      if (checkOut <= checkIn) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      // Calculate room subtotal
      const roomSubtotal = createRoomBookingDto.roomPrice * createRoomBookingDto.numberOfNights;
      const guestCount = createRoomBookingDto.guestCount || 1;
      const mealGuestCount = createRoomBookingDto.mealGuestCount || 0;

      // Build meal snapshot data
      let mealPlanId: string | undefined;
      let mealPlanName: string | undefined;
      let mealPlanType: string | undefined;
      let mealPricingType: string | undefined;
      let mealPrice = 0;
      let mealSubtotal = 0;
      let mealItems: any = null;

      if (createRoomBookingDto.mealPlanId) {
        const mealPlan = await this.mealPlanService.findOne(createRoomBookingDto.mealPlanId);

        if (!mealPlan.isActive) {
          throw new BadRequestException('Selected meal plan is not active');
        }

        mealPlanId = mealPlan.id;
        mealPlanName = mealPlan.name;
        mealPlanType = mealPlan.type;
        mealPricingType = mealPlan.pricingType;
        mealPrice = mealPlan.price;
        mealItems = mealPlan.items
          .filter((item) => item.isActive)
          .map((item) => ({ name: item.name, description: item.description }));

        const effectiveMealGuestCount = mealGuestCount > 0 ? mealGuestCount : guestCount;
        mealSubtotal = this.calculateMealSubtotal(
          mealPlan.price,
          mealPlan.pricingType,
          effectiveMealGuestCount,
          createRoomBookingDto.numberOfNights,
        );
      }

      // Calculate totals
      const subtotal = roomSubtotal + mealSubtotal;
      const discount = createRoomBookingDto.discount || 0;
      const total = subtotal - discount;
      const paid = createRoomBookingDto.paid || 0;
      const balance = total - paid;

      const bookingData: any = {
        roomId: createRoomBookingDto.roomId,
        userId: createRoomBookingDto.userId,
        userName: createRoomBookingDto.userName,
        userEmail: createRoomBookingDto.userEmail,
        userPhone: createRoomBookingDto.userPhone,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount,
        numberOfNights: createRoomBookingDto.numberOfNights,
        roomPrice: createRoomBookingDto.roomPrice,
        roomSubtotal,
        mealPlanId,
        mealPlanName,
        mealPlanType,
        mealPricingType,
        mealPrice,
        mealGuestCount: createRoomBookingDto.mealPlanId
          ? (mealGuestCount > 0 ? mealGuestCount : guestCount)
          : 0,
        mealSubtotal,
        mealItems,
        subtotal,
        discount,
        total,
        paid,
        balance,
        status: createRoomBookingDto.status || 'pending',
        notes: createRoomBookingDto.notes,
      };

      if (createdBy) {
        bookingData.createdBy = createdBy;
      }

      // Update room status to "booked"
      await this.roomService.update(createRoomBookingDto.roomId, { status: 'booked' });

      const booking = await this.roomBookingRepository.create(bookingData);

      return booking;
    } catch (error) {
      console.error('Error creating room booking:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<RoomBooking[]> {
    try {
      return await this.roomBookingRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all room bookings:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<RoomBooking> {
    try {
      const booking = await this.roomBookingRepository.findOne(id);
      if (!booking) {
        throw new NotFoundException(`Room booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error finding room booking with id ${id}:`, error);
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<RoomBooking[]> {
    try {
      return await this.roomBookingRepository.findByRoomId(roomId);
    } catch (error) {
      console.error(`Error finding bookings for room ${roomId}:`, error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<RoomBooking[]> {
    try {
      return await this.roomBookingRepository.findByUserId(userId);
    } catch (error) {
      console.error(`Error finding bookings for user ${userId}:`, error);
      throw error;
    }
  }

  async update(id: string, updateRoomBookingDto: UpdateRoomBookingDto): Promise<RoomBooking> {
    try {
      const existingBooking = await this.findOne(id);

      // Recalculate if relevant fields are updated
      const roomPrice = updateRoomBookingDto.roomPrice ?? existingBooking.roomPrice;
      const numberOfNights = updateRoomBookingDto.numberOfNights ?? existingBooking.numberOfNights;
      const discount = updateRoomBookingDto.discount ?? existingBooking.discount;
      const paid = updateRoomBookingDto.paid ?? existingBooking.paid;
      const guestCount = updateRoomBookingDto.guestCount ?? existingBooking.guestCount;

      const roomSubtotal = roomPrice * numberOfNights;

      // Handle meal plan update
      let mealSubtotal = existingBooking.mealSubtotal;
      let mealGuestCount = updateRoomBookingDto.mealGuestCount ?? existingBooking.mealGuestCount;
      const mealSnapshotUpdate: any = {};

      if (updateRoomBookingDto.mealPlanId !== undefined) {
        if (updateRoomBookingDto.mealPlanId === null || updateRoomBookingDto.mealPlanId === '') {
          // Removing meal plan
          mealSnapshotUpdate.mealPlanId = null;
          mealSnapshotUpdate.mealPlanName = null;
          mealSnapshotUpdate.mealPlanType = null;
          mealSnapshotUpdate.mealPricingType = null;
          mealSnapshotUpdate.mealPrice = 0;
          mealSnapshotUpdate.mealGuestCount = 0;
          mealSnapshotUpdate.mealSubtotal = 0;
          mealSnapshotUpdate.mealItems = null;
          mealSubtotal = 0;
          mealGuestCount = 0;
        } else {
          // Changing meal plan — re-snapshot
          const mealPlan = await this.mealPlanService.findOne(updateRoomBookingDto.mealPlanId);

          if (!mealPlan.isActive) {
            throw new BadRequestException('Selected meal plan is not active');
          }

          const effectiveMealGuestCount = mealGuestCount > 0 ? mealGuestCount : guestCount;
          mealSubtotal = this.calculateMealSubtotal(
            mealPlan.price,
            mealPlan.pricingType,
            effectiveMealGuestCount,
            numberOfNights,
          );

          mealSnapshotUpdate.mealPlanId = mealPlan.id;
          mealSnapshotUpdate.mealPlanName = mealPlan.name;
          mealSnapshotUpdate.mealPlanType = mealPlan.type;
          mealSnapshotUpdate.mealPricingType = mealPlan.pricingType;
          mealSnapshotUpdate.mealPrice = mealPlan.price;
          mealSnapshotUpdate.mealGuestCount = effectiveMealGuestCount;
          mealSnapshotUpdate.mealSubtotal = mealSubtotal;
          mealSnapshotUpdate.mealItems = mealPlan.items
            .filter((item) => item.isActive)
            .map((item) => ({ name: item.name, description: item.description }));
        }
      } else if (
        updateRoomBookingDto.mealGuestCount !== undefined ||
        updateRoomBookingDto.numberOfNights !== undefined
      ) {
        // Recalculate meal subtotal if guest count or nights changed but meal plan stayed the same
        if (existingBooking.mealPlanId && existingBooking.mealPricingType) {
          const effectiveMealGuestCount = mealGuestCount > 0 ? mealGuestCount : guestCount;
          mealSubtotal = this.calculateMealSubtotal(
            existingBooking.mealPrice,
            existingBooking.mealPricingType,
            effectiveMealGuestCount,
            numberOfNights,
          );
          mealSnapshotUpdate.mealGuestCount = effectiveMealGuestCount;
          mealSnapshotUpdate.mealSubtotal = mealSubtotal;
        }
      }

      const subtotal = roomSubtotal + mealSubtotal;
      const total = subtotal - discount;
      const balance = total - paid;

      const updateData: any = {
        ...updateRoomBookingDto,
        ...mealSnapshotUpdate,
        roomSubtotal,
        subtotal,
        total,
        balance,
        guestCount,
      };

      // Remove client-side input fields that are already processed into snapshot
      delete updateData.mealPlanId;
      if (mealSnapshotUpdate.mealPlanId !== undefined) {
        updateData.mealPlanId = mealSnapshotUpdate.mealPlanId;
      } else if (updateRoomBookingDto.mealPlanId === undefined) {
        // Don't touch mealPlanId if not being updated
        delete updateData.mealPlanId;
      }
      delete updateData.mealGuestCount;
      if (mealSnapshotUpdate.mealGuestCount !== undefined) {
        updateData.mealGuestCount = mealSnapshotUpdate.mealGuestCount;
      }

      // Handle date updates
      if (updateRoomBookingDto.checkInDate) {
        updateData.checkInDate = new Date(updateRoomBookingDto.checkInDate);
      }
      if (updateRoomBookingDto.checkOutDate) {
        updateData.checkOutDate = new Date(updateRoomBookingDto.checkOutDate);
      }

      // Validate dates if both are being updated
      if (updateData.checkInDate && updateData.checkOutDate) {
        if (updateData.checkOutDate <= updateData.checkInDate) {
          throw new BadRequestException('Check-out date must be after check-in date');
        }
      }

      return await this.roomBookingRepository.update(id, updateData);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Room booking with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.roomBookingRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Room booking with ID ${id} not found`);
      }
      throw error;
    }
  }

  async addPayment(id: string, amount: number): Promise<RoomBooking> {
    try {
      const booking = await this.findOne(id);

      if (amount <= 0) {
        throw new BadRequestException('Payment amount must be greater than 0');
      }

      const newPaid = booking.paid + amount;
      const newBalance = booking.total - newPaid;

      if (newPaid > booking.total) {
        throw new BadRequestException('Payment amount exceeds total booking amount');
      }

      return await this.roomBookingRepository.update(id, {
        paid: newPaid,
      });
    } catch (error) {
      console.error(`Error adding payment to booking ${id}:`, error);
      throw error;
    }
  }

  async releaseRoom(bookingId: string): Promise<RoomBooking> {
    try {
      const booking = await this.findOne(bookingId);

      if (booking.status === 'checked-out' || booking.status === 'cancelled') {
        throw new BadRequestException(`Booking is already "${booking.status}" and the room has been released`);
      }

      // Update room status back to "available"
      await this.roomService.update(booking.roomId, { status: 'available' });

      // Update booking status to "checked-out"
      const updatedBooking = await this.roomBookingRepository.update(bookingId, {
        status: 'checked-out',
      });

      return updatedBooking;
    } catch (error) {
      console.error(`Error releasing room for booking ${bookingId}:`, error);
      throw error;
    }
  }

  calculateBalance(booking: RoomBooking): number {
    return booking.total - booking.paid;
  }
}

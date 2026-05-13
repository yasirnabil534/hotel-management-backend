Yes. Here is the clean scalable schema story for your hotel room booking + meal plan system.

**Story**
Hotel admin creates meal plans from the hotel management panel.

Example:

```text
Meal Plan: Breakfast Only
Type: package
Pricing: per_guest_per_night
Price: 500
Items:
- Bread
- Egg
- Coffee
```

```text
Meal Plan: Dinner Buffet
Type: buffet
Pricing: per_guest_per_night
Price: 1500
Items:
- Rice
- Chicken
- Fish
- Salad
- Dessert
```

During room booking, the admin selects **one meal plan**:

```text
Guest: John Doe
Room: Deluxe 201
Nights: 2
Guests: 3
Selected meal plan: Dinner Buffet
```

The system calculates:

```text
Room subtotal = roomPrice * numberOfNights
Meal subtotal = mealPrice * mealGuestCount * numberOfNights
Total = roomSubtotal + mealSubtotal - discount
Balance = total - paid
```

And the booking stores a snapshot:

```text
mealPlanName: "Dinner Buffet"
mealPlanType: "buffet"
mealPrice: 1500
mealItemsSnapshot: [...]
```

So if the hotel changes the buffet later, old bookings stay correct.

**Prisma Schema Design**

```prisma
model Hotel {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  name            String
  address         String
  rating          Float    @default(0)
  ownerId         String   @db.ObjectId
  hotelDetailsId  String?  @db.ObjectId
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  owner           User           @relation(fields: [ownerId], references: [id], onDelete: Restrict)
  hotelDetails    HotelDetails?  @relation(fields: [hotelDetailsId], references: [id], onDelete: SetNull)

  mealPlans       MealPlan[]
}
```

```prisma
model MealPlan {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  hotelId     String   @db.ObjectId

  name        String
  description String?
  type        String   @default("package") 
  // package, buffet

  pricingType String   @default("per_guest_per_night")
  // per_booking, per_night, per_guest, per_guest_per_night

  price       Float
  isActive    Boolean  @default(true)

  createdBy   String?  @db.ObjectId
  updatedBy   String?  @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  hotel       Hotel      @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  items       MealItem[]
}
```

```prisma
model MealItem {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  mealPlanId  String   @db.ObjectId

  name        String
  description String?
  isActive    Boolean  @default(true)

  createdBy   String?  @db.ObjectId
  updatedBy   String?  @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  mealPlan    MealPlan @relation(fields: [mealPlanId], references: [id], onDelete: Cascade)
}
```

Update your existing `RoomBooking` model with meal snapshot fields:

```prisma
model RoomBooking {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  roomId          String   @db.ObjectId
  userId          String?  @db.ObjectId

  userName        String
  userEmail       String?
  userPhone       String?

  checkInDate     DateTime
  checkOutDate    DateTime

  guestCount      Int      @default(1)
  numberOfNights  Int

  roomPrice       Float
  roomSubtotal    Float

  mealPlanId      String?  @db.ObjectId
  mealPlanName    String?
  mealPlanType    String?
  mealPricingType String?
  mealPrice       Float    @default(0)
  mealGuestCount  Int      @default(0)
  mealSubtotal    Float    @default(0)
  mealItems       Json?

  subtotal        Float
  discount        Float    @default(0)
  total           Float
  paid            Float    @default(0)
  balance         Float

  status          String   @default("pending")
  notes           String?

  createdBy       String?  @db.ObjectId
  updatedBy       String?  @db.ObjectId
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  room            Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  user            User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

**Example Booking Snapshot**

```json
{
  "mealPlanId": "abc123",
  "mealPlanName": "Dinner Buffet",
  "mealPlanType": "buffet",
  "mealPricingType": "per_guest_per_night",
  "mealPrice": 1500,
  "mealGuestCount": 3,
  "mealSubtotal": 9000,
  "mealItems": [
    { "name": "Rice" },
    { "name": "Chicken" },
    { "name": "Fish" },
    { "name": "Salad" },
    { "name": "Dessert" }
  ]
}
```

Final scalable concept:

```text
MealPlan = hotel’s current meal setup
MealItem = included/display items under the meal plan
RoomBooking = selected meal snapshot for billing/history
```

This design supports normal packages, buffet, per-person pricing, old booking history, and future reporting without making booking too complex.
# Frontend implementation plan — meal plans and room bookings

This document is for frontend developers integrating the hotel admin panel with the NestJS backend. It covers **meal plan CRUD**, **meal items**, and **room booking** flows including meal selection, pricing display rules, and stored snapshots.

Reference backend story and schema notes: `develop.md`. Live contract: Swagger UI at `{API_ORIGIN}/api` (Bearer JWT).

---

## 1. Goals and domain rules

1. **Meal plans are hotel-scoped.** Each plan belongs to a `hotelId`. Admin creates and maintains plans (name, type, pricing, price, items).
2. **Room booking may attach zero or one meal plan.** The client sends `mealPlanId` (and optionally `mealGuestCount`). The server loads the current plan, verifies it is active, and persists a **snapshot** on the booking (name, type, pricing type, unit price, guest count used for meal, subtotal, item list). Future edits to the plan do not change old bookings.
3. **Totals are authoritative on the server.** The UI should show the same formulas for transparency, but **create/update responses** carry the final `roomSubtotal`, `mealSubtotal`, `subtotal`, `total`, `balance`.

---

## 2. Technical prerequisites

| Topic | Detail |
|--------|--------|
| **Auth** | All endpoints below use `Authorization: Bearer <access_token>` (same JWT as the rest of the app). |
| **Response shape** | Success: `{ statusCode, statusMessage: 'Success', data }`. Error: `{ statusCode, statusMessage: 'Failed', error: string }`. |
| **IDs** | Mongo ObjectId strings. |
| **Dates** | Send ISO 8601 strings for DTOs (e.g. `checkInDate` / `checkOutDate`). Responses may serialize as ISO strings depending on client. |
| **List queries** | `GET` list routes use `QueryProcessorInterceptor`: boolean query params can be sent as strings `'true'` / `'false'`; `page`, `limit`, `sortBy`, `sortOrder` are supported where documented. |

**Base paths (no global API prefix in current backend):**

- Meal plans: `/meal-plans`
- Room bookings: `/room-bookings`

---

## 3. Enums and copy for the UI

Use consistent labels and validation messages.

### Meal plan `type`

- `package` — e.g. fixed package
- `buffet` — e.g. buffet

### Meal plan `pricingType`

| Value | Meaning (for help text) |
|--------|-------------------------|
| `per_booking` | One flat fee per booking |
| `per_night` | Fee × number of nights |
| `per_guest` | Fee × guests covered by the meal |
| `per_guest_per_night` | Fee × meal guests × nights (default server behavior if unknown) |

### Room booking `status` (for filters and badges)

`pending`, `confirmed`, `checked-in`, `checked-out`, `cancelled` (align with existing booking UI).

---

## 4. Feature A — Meal plan management

### 4.1 User stories

1. As an admin, I can list meal plans for a hotel with filters (active only for booking picker, search by name/description).
2. I can create a plan with optional initial items in one request.
3. I can edit plan metadata and soft-disable a plan (`isActive: false`) so it cannot be selected for new bookings.
4. I can add, edit, and remove individual items under a plan.

### 4.2 API reference

| Action | Method | Path | Body / query |
|--------|--------|------|----------------|
| Create plan | `POST` | `/meal-plans` | `CreateMealPlanDto`: `hotelId`, `name`, `price` required; optional `description`, `type`, `pricingType`, `items[]` (`name`, optional `description`) |
| List plans | `GET` | `/meal-plans` | Query: `hotelId`, `isActive`, `type`, `search`, `page`, `limit`, `sortBy`, `sortOrder` |
| Get one | `GET` | `/meal-plans/:id` | — |
| Update plan | `PATCH` | `/meal-plans/:id` | Partial: `name`, `description`, `type`, `pricingType`, `price`, `isActive` |
| Delete plan | `DELETE` | `/meal-plans/:id` | — |
| Add item | `POST` | `/meal-plans/:id/items` | `{ name, description? }` |
| Update item | `PATCH` | `/meal-plans/:id/items/:itemId` | Partial: `name`, `description`, `isActive` |
| Remove item | `DELETE` | `/meal-plans/:id/items/:itemId` | — |

### 4.3 UI modules (suggested)

1. **Hotel meal plans list** — table or cards; columns: name, type, pricing type, price, active, item count; row actions: edit, manage items, delete (with confirm).
2. **Meal plan form (create/edit)** — fields matching DTOs; show human-readable explanation for `pricingType`.
3. **Items panel** — nested list under a plan; inline or modal add/edit; toggle `isActive` on items if the product needs to hide lines without deleting history (items are snapshotted on booking from active items only).

### 4.4 Frontend validation (client-side)

- `price` ≥ 0; `name` required on plan and item.
- Restrict `type` and `pricingType` to known values (dropdowns).
- After create, navigate to detail or refresh list; handle `201` envelope.

---

## 5. Feature B — Room booking with meal plan

### 5.1 User stories

1. When creating a booking, admin picks dates, room, guest count, optional linked user, discount, paid amount, notes.
2. Admin may select **one optional meal plan** from plans filtered by **same hotel as the room** (the UI should filter client-side or via `hotelId` + `isActive=true` on `/meal-plans`).
3. Admin sets **meal guest count** when a subset of guests should be charged for meals; if omitted or `0`, the backend uses **`guestCount`** for meal calculation.
4. Booking detail shows **snapshot** fields (plan name, type, pricing, line items) for historical accuracy.

### 5.2 Create booking — `POST /room-bookings`

Required body fields: `roomId`, `userName`, `checkInDate`, `checkOutDate`, `roomPrice`, `numberOfNights`.

Optional: `userId`, `userEmail`, `userPhone`, `guestCount` (default 1), **`mealPlanId`**, **`mealGuestCount`**, `discount`, `paid`, `status`, `notes`.

**Server behavior the UI must respect:**

- Room must exist and be `available`; otherwise conflict / error.
- `checkOutDate` must be after `checkInDate`.
- If `mealPlanId` is set: plan must exist and **`isActive === true`**, or the API returns a bad request.
- Meal snapshot and `mealSubtotal` are computed server-side; **`mealGuestCount` on stored booking** is `0` when no meal plan; otherwise it is the effective count used (explicit `mealGuestCount` if &gt; 0, else `guestCount`).

### 5.3 Update booking — `PATCH /room-bookings/:id`

Partial updates supported for the same guest/date/price/nights fields plus `mealPlanId` and `mealGuestCount`.

**Meal plan changes:**

- **New plan id:** server re-fetches the plan, re-snapshots items and pricing, recalculates `mealSubtotal` and totals.
- **Remove meal:** send `mealPlanId` as empty string or `null` (per backend branch) to clear snapshot and zero meal totals — confirm exact serialization with integration tests; backend treats `null` or `''` as removal.
- **Nights or meal guest count change without changing plan:** server recalculates meal subtotal using **existing snapshot** `mealPrice` and `mealPricingType` (not the live plan price).

The UI should reload the returned booking after patch.

### 5.4 Other booking endpoints (existing)

| Action | Method | Path |
|--------|--------|------|
| List | `GET` | `/room-bookings` — query includes `hotelId`, `roomId`, `userId`, `status`, `phone`, `email`, date ranges, `search`, pagination |
| Get one | `GET` | `/room-bookings/:id` |
| Add payment | `POST` | `/room-bookings/:id/payment` — body `{ amount }` |
| Release room | `POST` | `/room-bookings/:id/release` |
| Delete | `DELETE` | `/room-bookings/:id` |

**Listing by room:** Prefer `GET /room-bookings?roomId=<objectId>` so filters match the controller’s `findAll` contract. If dedicated nested routes are added later, align with Swagger.

### 5.5 Display formulas (for “preview” before submit)

Let `nights = numberOfNights`, `guests = guestCount`, `mealGuests = mealGuestCount > 0 ? mealGuestCount : guests`.

- `roomSubtotal = roomPrice * nights`
- Meal subtotal from selected plan’s `price` and `pricingType`:

  - `per_booking` → `price`
  - `per_night` → `price * nights`
  - `per_guest` → `price * mealGuests`
  - `per_guest_per_night` → `price * mealGuests * nights`

- `subtotal = roomSubtotal + mealSubtotal`
- `total = subtotal - (discount || 0)`
- `balance = total - (paid || 0)`

Show a disclaimer that **invoice numbers match the API response** after save.

### 5.6 Booking detail / print view

Render snapshot block when `mealPlanId` or `mealPlanName` is present:

- Title: `mealPlanName`
- Chips or text: `mealPlanType`, `mealPricingType`
- Amounts: `mealPrice`, `mealGuestCount`, `mealSubtotal`
- List `mealItems` (array of `{ name, description? }`)

Do not fetch the live meal plan for historical totals; use snapshot fields only.

---

## 6. TypeScript types (suggested)

Align with API responses; adjust `Date` vs `string` per your HTTP client.

```typescript
type MealPlanType = 'package' | 'buffet';
type MealPricingType = 'per_booking' | 'per_night' | 'per_guest' | 'per_guest_per_night';

interface MealItem {
  id: string;
  mealPlanId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MealPlan {
  id: string;
  hotelId: string;
  name: string;
  description?: string;
  type: MealPlanType | string;
  pricingType: MealPricingType | string;
  price: number;
  isActive: boolean;
  items: MealItem[];
  createdAt: string;
  updatedAt: string;
}

interface RoomBooking {
  id: string;
  roomId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  numberOfNights: number;
  roomPrice: number;
  roomSubtotal: number;
  mealPlanId?: string | null;
  mealPlanName?: string | null;
  mealPlanType?: string | null;
  mealPricingType?: string | null;
  mealPrice: number;
  mealGuestCount: number;
  mealSubtotal: number;
  mealItems?: { name: string; description?: string }[] | null;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  balance: number;
  status: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Implementation order (recommended)

1. **API client layer** — typed functions for `/meal-plans` and `/room-bookings`; central error handling for `error` message string.
2. **Meal plan list + filters** — `hotelId`, `isActive`, `search`.
3. **Meal plan create/edit + items** — including `isActive` on plan for “disable for new bookings”.
4. **Booking form** — room picker (available only), dates, guest count, optional meal plan picker (plans filtered `isActive` + hotel match), `mealGuestCount` optional field with helper text.
5. **Price preview** — mirror server formulas; on success, replace with response totals.
6. **Booking detail** — snapshot section and payment/release actions if already in your app.
7. **QA checklist** — inactive plan blocked; room not available; checkout before checkin; change nights with meal and verify `mealSubtotal` uses snapshot price; remove meal on update.

---

## 8. Open points to verify during integration

1. **Removing a meal on PATCH** — confirm whether the API expects `mealPlanId: null`, empty string, or omission; align the client once verified against Swagger or a quick integration test.
2. **Room ↔ hotel association** — ensure the meal plan picker only shows plans for the hotel that owns the selected room (derive `hotelId` from room detail if the booking form already loads room).
3. **`addPayment` balance** — backend recalculates `paid` and should return updated booking; confirm whether `balance` is recomputed in the persisted row on every read.

---

## 9. Deliverables checklist for the frontend PR

- [ ] Meal plan CRUD UI + items CRUD wired to documented routes.
- [ ] Booking create/update sends `mealPlanId` / `mealGuestCount` as needed; handles validation errors from API.
- [ ] Booking UI shows meal snapshot on detail/history views.
- [ ] Copy/tooltips explain `pricingType` and effective meal guest count.
- [ ] Swagger `/api` exercised for happy paths and main error paths.

---

_End of plan._

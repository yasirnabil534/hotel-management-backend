Here’s the frontend handoff, including the latest validation change.

**Order Tracking Status**
Backend now supports this order tracking flow:

```ts
pending -> received -> in_progress -> done
```

Allowed status values:

```ts
"pending" | "received" | "in_progress" | "done"
```

Recommended display labels:

```ts
Pending
Received
In Progress
Done
```

`done` means the order is completed after payment.

**Customer/Room Side**
Use this endpoint to show the logged-in customer or room’s orders:

```http
GET /orders/tracking/me
Authorization: Bearer <token>
```

Frontend should:
- Show an order tracking stepper/timeline.
- Highlight completed steps up to the current `order.status`.
- Use the status order from `GET /orders/tracking/statuses`.
- For room login, the same endpoint works with the room token.

**Admin Side**
Use this endpoint to list hotel orders for tracking:

```http
GET /orders/tracking/hotel/:hotelId
```

Admin can update order status with:

```http
PATCH /orders/:id/status
Content-Type: application/json
```

Body:

```json
{
  "status": "in_progress"
}
```

Other valid bodies:

```json
{ "status": "pending" }
{ "status": "received" }
{ "status": "done" }
```

**Status Metadata Endpoint**
Use this to build dropdowns/steppers dynamically:

```http
GET /orders/tracking/statuses
```

Response:

```json
{
  "statusCode": 200,
  "statusMessage": "Success",
  "data": [
    {
      "step": 1,
      "value": "pending",
      "label": "Pending"
    },
    {
      "step": 2,
      "value": "received",
      "label": "Received"
    },
    {
      "step": 3,
      "value": "in_progress",
      "label": "In Progress"
    },
    {
      "step": 4,
      "value": "done",
      "label": "Done"
    }
  ]
}
```

**Order List Filtering**
Existing order list now supports status filtering:

```http
GET /orders?status=pending
GET /orders?status=received
GET /orders?status=in_progress
GET /orders?status=done
```

It also supports room filtering:

```http
GET /orders?roomId=<roomId>
GET /orders/room/:roomId
```

Existing endpoints still work:

```http
GET /orders/customer/:customerId
GET /orders/hotel/:hotelId
GET /orders/hotel/:hotelId/customer/:customerId
GET /orders/:id
```

**Create Order**
Frontend can create an order with:

```http
POST /orders
Content-Type: application/json
```

For user/customer order:

```json
{
  "hotelId": "REAL_HOTEL_ID",
  "userId": "REAL_USER_ID",
  "orderProducts": [
    {
      "productId": "REAL_PRODUCT_ID",
      "quantity": 2,
      "price": 150
    }
  ]
}
```

For room order:

```json
{
  "hotelId": "REAL_HOTEL_ID",
  "roomId": "REAL_ROOM_ID",
  "orderProducts": [
    {
      "productId": "REAL_PRODUCT_ID",
      "quantity": 1,
      "price": 250
    }
  ]
}
```

Frontend does **not** need to send `status`; backend defaults it to `pending`.

Frontend does **not** need to send `total`; backend calculates it from:

```ts
price * quantity
```

**Important Validation Change**
Backend now validates product IDs before creating an order.

If frontend sends a fake/deleted/invalid `productId`, backend returns `400` instead of crashing.

Example error:

```json
{
  "statusCode": 400,
  "statusMessage": "Failed",
  "error": "Invalid productId(s): 663b9f8d2f4a1c0012a33333"
}
```

So frontend should:
- Only send product IDs that came from the backend product list.
- Show a friendly error if order creation fails because a product is unavailable.
- Refresh products/cart if this error appears.

**Frontend Summary**
Add or update:
- Customer order tracking screen.
- Room/customer order history tracking UI.
- Admin order tracking table/list.
- Admin status dropdown/actions.
- Use `PATCH /orders/:id/status` when admin changes status.
- Use `GET /orders/tracking/statuses` instead of hardcoding labels if possible.
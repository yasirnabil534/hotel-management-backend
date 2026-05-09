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
Existing order list now supports standard status filtering:

```http
GET /orders?status=pending
GET /orders?status=received
GET /orders?status=in_progress
GET /orders?status=done
GET /orders?status=cancelled
```

It also supports advanced virtual status filters for the admin table:

```http
GET /orders?status=active
GET /orders?status=canceled_by_admin
GET /orders?status=canceled_by_customer
```

- `active`: Returns orders that are `pending`, `received`, or `in_progress` (excludes `done` and `cancelled`).
- `canceled_by_admin`: Returns orders cancelled by an admin user.
- `canceled_by_customer`: Returns orders cancelled by the room (customer).

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

***Pending Implementation***

**Order Cancellation**
Both admin and room (customer) can cancel an order before it reaches `done` status:

```http
PATCH /orders/:id/cancel
Authorization: Bearer <token>
```

No request body needed. Backend validates the order is in a cancellable state (`pending`, `received`, or `in_progress`). Orders with `done` or `cancelled` status will return `400`.

Allowed status values (updated):

```ts
"pending" | "received" | "in_progress" | "done" | "cancelled"
```

**Real-time Order Updates (WebSocket)**
Backend now pushes real-time order updates via Socket.IO. When admin changes a status or anyone cancels an order, all connected clients for that hotel receive the update instantly.

**Connection Setup:**

```ts
import { io } from 'socket.io-client';

const socket = io('http://<backend-host>:<port>/orders');

// Join a hotel room to receive its order events
socket.emit('join-hotel', { hotelId: 'REAL_HOTEL_ID' });
```

**Events to listen for:**

| Event | When | Payload |
|---|---|---|
| `order:status-updated` | Admin changes order status | Full order object |
| `order:cancelled` | Admin or room cancels order | Full order object |

**Frontend integration example:**

```ts
// Listen for status updates
socket.on('order:status-updated', (order) => {
  // Update the order in your local state / tracking UI
  console.log(`Order ${order.id} status changed to: ${order.status}`);
});

// Listen for cancellations
socket.on('order:cancelled', (order) => {
  // Update UI to show cancelled state
  console.log(`Order ${order.id} was cancelled`);
});

// Leave hotel room when navigating away
socket.emit('leave-hotel', { hotelId: 'REAL_HOTEL_ID' });
```

**Frontend Summary**
Add or update:
- Customer order tracking screen.
- Room/customer order history tracking UI.
- Admin order tracking table/list.
- Admin status dropdown/actions.
- Cancel button on both admin and room (customer) side.
- Use `PATCH /orders/:id/status` when admin changes status.
- Use `PATCH /orders/:id/cancel` when admin or room cancels.
- Use `GET /orders/tracking/statuses` instead of hardcoding labels if possible.
- Connect to WebSocket namespace `/orders` for real-time updates.
- Join the hotel room via `join-hotel` event on connect.
- Listen for `order:status-updated` and `order:cancelled` events.
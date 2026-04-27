# API Documentation

## 🌐 Production API

**Base URL:** `https://your-domain.vercel.app`

## 📚 Interactive Documentation

Due to Vercel serverless limitations, the Swagger UI interface doesn't render at `/api`. However, you can access full interactive documentation using these methods:

### Method 1: Swagger Editor (Recommended)

1. **Get the API specification:**
   ```
   https://your-domain.vercel.app/api-json
   ```

2. **Open Swagger Editor:**
   - Go to: https://editor.swagger.io/
   - Copy the JSON from `/api-json`
   - Paste it into the editor
   - Full interactive documentation with "Try it out" functionality!

### Method 2: Postman/Insomnia

**Import OpenAPI Spec:**
1. Open Postman/Insomnia
2. Import → OpenAPI
3. Use URL: `https://your-domain.vercel.app/api-json`
4. All endpoints will be imported automatically

### Method 3: Local Documentation

Run the API locally to access Swagger UI:
```bash
npm run start:dev
```

Then open: http://localhost:6001/api

## 🔑 Authentication

Most endpoints require JWT authentication. Get a token by:

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Then use the token in subsequent requests:
```
Authorization: Bearer <your_token>
```

## 🧪 Quick Test Endpoints

### Health Check
```
GET https://your-domain.vercel.app/
```
Returns: "Hello World!"

### Login (Admin/Staff)
```
POST https://your-domain.vercel.app/auth/login
Content-Type: application/json

{
  "email": "admin@hotel.com",
  "password": "your_password"
}
```

### Room Login
```
POST https://your-domain.vercel.app/auth/login/room
Content-Type: application/json

{
  "roomCode": "ROOM_CODE_HERE"
}
```

### Get Profile
```
GET https://your-domain.vercel.app/auth/me
Authorization: Bearer <your_token>
```

## 📋 Available Endpoints

All endpoints are documented in the OpenAPI specification at `/api-json`.

Main endpoint groups:
- `/auth/*` - Authentication
- `/users/*` - User management
- `/rooms/*` - Room management
- `/room-sessions/*` - Room session management
- `/room-bookings/*` - Room booking management
- `/orders/*` - Order management
- `/products/*` - Product management
- `/services/*` - Service management
- `/hotels/*` - Hotel management
- `/categories/*` - Category management
- `/carts/*` - Shopping cart management

## 🔧 Environment Variables

Required environment variables (set in Vercel):
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ENCRYPTION_KEY` - Encryption key for sensitive data

## 🐛 Troubleshooting

### Issue: Cannot GET /endpoint
**Cause:** Endpoint requires POST method
**Solution:** Check the API spec - most mutation endpoints use POST

### Issue: 401 Unauthorized
**Cause:** Missing or invalid JWT token
**Solution:** Login first and use the token in Authorization header

### Issue: 404 Not Found
**Cause:** Endpoint doesn't exist or wrong URL
**Solution:** Check the full endpoint list in `/api-json`

## 📞 Support

For API support, check:
1. OpenAPI spec: `/api-json`
2. Repository README
3. Deployment logs in Vercel dashboard

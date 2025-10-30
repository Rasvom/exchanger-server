# API Examples

This document provides practical examples of API requests and responses.

## Base URL

```
http://localhost:3000
```

---

## Authentication

### User Registration

**Request:**
```bash
curl -X POST http://localhost:3000/user-service/registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "fullName": "John Doe"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### User Login

**Request:**
```bash
curl -X POST http://localhost:3000/user-service/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile

**Request:**
```bash
curl -X GET http://localhost:3000/user-service/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Refresh Tokens

**Request:**
```bash
curl -X GET http://localhost:3000/user-service/refresh-tokens \
  -b "refreshToken=YOUR_REFRESH_TOKEN"
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Requests Management

### Create Request

**Request:**
```bash
curl -X POST http://localhost:3000/requests \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sendCurrency": "bitcoin",
    "receiveCurrency": "rub",
    "sendAmount": 0.5,
    "receiveAmount": 1500000,
    "receiveAccountNumber": "1234567890123456",
    "recipientName": "John Doe",
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "status": "PENDING",
  "sendCurrency": "bitcoin",
  "receiveCurrency": "rub",
  "sendAmount": 0.5,
  "receiveAmount": 1500000,
  "receiveAccountNumber": "1234567890123456",
  "recipientName": "John Doe",
  "email": "user@example.com",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

### Get User Requests (with pagination)

**Request:**
```bash
curl -X GET "http://localhost:3000/requests?page=1&limit=10&status=PENDING&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "status": "PENDING",
      "sendAmount": 0.5,
      "receiveAmount": 1500000,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "stats": {
    "PENDING": {
      "count": 10,
      "totalSendAmount": 5,
      "totalReceiveAmount": 15000000
    },
    "COMPLETED": {
      "count": 40,
      "totalSendAmount": 20,
      "totalReceiveAmount": 60000000
    }
  }
}
```

### Get Single Request

**Request:**
```bash
curl -X GET http://localhost:3000/requests/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "status": "PROCESSING",
  "sendCurrency": "bitcoin",
  "receiveCurrency": "rub",
  "sendAmount": 0.5,
  "receiveAmount": 1500000,
  "manager": {
    "_id": "507f1f77bcf86cd799439013",
    "fullName": "Admin User"
  },
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

---

## Manager/Admin Endpoints

### Manager Login

**Request:**
```bash
curl -X POST http://localhost:3000/manager-service/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get All Requests (Manager)

**Request:**
```bash
curl -X GET "http://localhost:3000/manager-service/requests?page=1&limit=20&status=PENDING" \
  -H "Authorization: Bearer MANAGER_ACCESS_TOKEN"
```

**Response:**
```json
{
  "requests": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Update Request Status

**Request:**
```bash
curl -X PATCH http://localhost:3000/manager-service/requests/507f1f77bcf86cd799439012/status \
  -H "Authorization: Bearer MANAGER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "status": "COMPLETED",
  "manager": "507f1f77bcf86cd799439013",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Cancel Request with Reason

**Request:**
```bash
curl -X PATCH http://localhost:3000/manager-service/requests/507f1f77bcf86cd799439012/status \
  -H "Authorization: Bearer MANAGER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CANCELED",
    "cancelReason": "Invalid payment details"
  }'
```

---

## Crypto Assets

### Get Crypto Prices

**Request:**
```bash
curl -X GET http://localhost:3000/trade-asset-service/prices
```

**Response:**
```json
{
  "bitcoin": 3000000.50,
  "ethereum": 150000.25,
  "tether": 90.50
}
```

### Get Available Assets

**Request:**
```bash
curl -X GET http://localhost:3000/trade-asset-service/assets
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Bitcoin",
    "symbol": "bitcoin",
    "active": true
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Ethereum",
    "symbol": "ethereum",
    "active": true
  }
]
```

---

## File Management

### Upload File

**Request:**
```bash
curl -X POST http://localhost:3000/file-service/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "cardNumber=1234567890123456"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "user": "507f1f77bcf86cd799439011",
  "cardNumber": "1234567890123456",
  "fileUrl": "https://s3.amazonaws.com/bucket/files/document.pdf",
  "verified": false,
  "createdAt": "2024-01-15T13:00:00.000Z"
}
```

### Get File by Card Number

**Request:**
```bash
curl -X GET http://localhost:3000/file-service/1234567890123456 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "cardNumber": "1234567890123456",
  "fileUrl": "https://s3.amazonaws.com/bucket/files/document.pdf",
  "verified": true,
  "verifiedAt": "2024-01-15T14:00:00.000Z"
}
```

---

## Health Check

### Check API Health

**Request:**
```bash
curl -X GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T15:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "memory": {
    "used": 45.67,
    "total": 128.00,
    "unit": "MB"
  },
  "database": {
    "status": "connected",
    "name": "exchanger"
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error",
  "details": "Password must be at least 6 characters"
}
```

### 401 Unauthorized

```json
{
  "error": "Token expired"
}
```

### 404 Not Found

```json
{
  "error": "Request not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests from your IP, please try again later"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## WebSocket Events

### Client Side (JavaScript)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Join user room
socket.emit('joinUserRoom', userId);

// Listen for request status changes
socket.on('userRequestStatusChanged', (data) => {
  console.log('Request updated:', data);
  // { requestId, status, updatedRequest }
});

// Join manager room (for managers)
socket.emit('joinManagerRoom');

// Listen for all request changes (managers)
socket.on('requestStatusChanged', (data) => {
  console.log('Any request updated:', data);
});

// Listen for active requests
socket.on('activeRequests', (requests) => {
  console.log('Active requests:', requests);
});
```

---

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per hour

---

## Notes

- Replace `YOUR_ACCESS_TOKEN` with actual JWT token
- Replace `MANAGER_ACCESS_TOKEN` with manager JWT token
- All timestamps are in ISO 8601 format
- Refresh token is stored in httpOnly cookie
- File uploads use multipart/form-data

---

## Testing with Postman

Import this collection: [Download Postman Collection](./postman_collection.json)

Or use the Swagger UI at: http://localhost:3000/api-docs

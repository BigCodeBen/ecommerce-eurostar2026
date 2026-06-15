# E-Commerce REST API

## Description

This project is a REST API for an e-commerce platform built with **Node.js** and **Express**. It provides user authentication via JWT tokens and a checkout flow with payment-method rules. All data is stored in memory — no database is required.

The API follows a layered architecture:

```
src/
├── controllers/   # Request/response handling
├── middleware/    # Authentication and error handling
├── models/        # In-memory data stores (users, products)
├── routes/        # Endpoint definitions
├── services/      # Business logic
├── app.js         # Express application setup
└── server.js      # Server entry point
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ecommerce-eurostar2026
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## How to Run

Start the server:

```bash
npm start
```

The API listens on **http://localhost:3000** by default. You can change the port with the `PORT` environment variable:

```bash
PORT=4000 npm start
```

Optional: set a custom JWT secret:

```bash
JWT_SECRET=your-secret-key npm start
```

## Rules

### Authentication

- Only authenticated users can perform checkout.
- Register or log in to receive a JWT token.
- Send the token in the `Authorization` header as `Bearer <token>`.

### Checkout

- **Payment methods:** only `cash` or `credit_card` are accepted.
- **Cash discount:** paying with `cash` applies a **10% discount** on the order subtotal.
- **Credit card:** no discount is applied.
- Each checkout item must include a valid `productId` and `quantity` (minimum 1).
- Stock is validated and reduced in memory when checkout succeeds.

## Existent Data

### Users (password for all: `password123`)

| ID | Username | Email               |
|----|----------|---------------------|
| 1  | alice    | alice@example.com   |
| 2  | bob      | bob@example.com     |
| 3  | carol    | carol@example.com   |

New users can be registered via the `/api/register` endpoint.

### Products

| ID | Name                 | Price  | Stock |
|----|----------------------|--------|-------|
| 1  | Wireless Headphones  | 79.99  | 50    |
| 2  | Mechanical Keyboard  | 129.99 | 30    |
| 3  | USB-C Hub            | 49.99  | 100   |

## How to Use the Rest API

Base URL: `http://localhost:3000/api`

### 1. Healthcheck

Verify the API is running.

**Request**

```http
GET /api/healthcheck
```

**Response** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-06-15T12:00:00.000Z"
}
```

---

### 2. Register

Create a new user account.

**Request**

```http
POST /api/register
Content-Type: application/json

{
  "username": "dave",
  "email": "dave@example.com",
  "password": "securepass"
}
```

**Response** `201 Created`

```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 4,
    "username": "dave",
    "email": "dave@example.com"
  }
}
```

---

### 3. Login

Authenticate and receive a JWT token.

**Request**

```http
POST /api/login
Content-Type: application/json

{
  "username": "alice",
  "password": "password123"
}
```

**Response** `200 OK`

```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com"
  }
}
```

---

### 4. Checkout

Complete a purchase (requires authentication).

**Request**

```http
POST /api/checkout
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ],
  "paymentMethod": "cash"
}
```

**Response** `200 OK`

```json
{
  "message": "Checkout completed successfully.",
  "order": {
    "orderId": 1718452800000,
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "name": "Wireless Headphones",
        "price": 79.99,
        "quantity": 2,
        "lineTotal": 159.98
      },
      {
        "productId": 3,
        "name": "USB-C Hub",
        "price": 49.99,
        "quantity": 1,
        "lineTotal": 49.99
      }
    ],
    "paymentMethod": "cash",
    "subtotal": 209.97,
    "discount": 21.0,
    "total": 188.97
  }
}
```

**Payment method values:** `cash` | `credit_card`

**Example with credit card (no discount)**

```json
{
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "credit_card"
}
```

---

### Error responses

| Status | Scenario                                      |
|--------|-----------------------------------------------|
| 400    | Missing or invalid request body               |
| 401    | Missing, invalid, or expired JWT token        |
| 404    | Product not found                             |
| 409    | Username or email already registered          |
| 500    | Unexpected server error                       |

Example error:

```json
{
  "error": "Payment method must be \"cash\" or \"credit_card\"."
}
```

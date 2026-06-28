# Ecommerce API Reference

This file documents all backend endpoints in this project and adds quick-start examples, required payloads, and behavior notes.

## Base URLs

- Main API: `/api/v1`
- Payments API: `/api/payments`

## Quick Start

### 1) Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
	-H "Content-Type: application/json" \
	-d '{
		"name": "Ahmed Ali",
		"email": "ahmed@example.com",
		"password": "secret123",
		"phone": "0123456789",
		"role": "customer"
	}'
```

### 2) Login (get token)

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
	-H "Content-Type: application/json" \
	-d '{
		"email": "ahmed@example.com",
		"password": "secret123"
	}'
```

### 3) Call protected endpoints

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
	-H "Authorization: Bearer <JWT_TOKEN>"
```

## Authentication And Roles

- Auth header format: `Authorization: Bearer <token>`
- Roles used by backend:
	- `admin`
	- `seller`
	- `customer`
- Public endpoints require no token.

## Common Response Shapes

Success examples:

```json
{ "status": "success", "data": {} }
```

```json
{ "results": 3, "orders": [] }
```

Error examples:

```json
{ "status": "fail", "message": "Authentication token is required", "isClientError": true }
```

```json
{ "status": "error", "message": "Something went wrong", "isClientError": false }
```

---

## Auth

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Creates account and sends verification email |
| GET | /api/v1/auth/verify-email?token=... | Public | Verifies email token |
| POST | /api/v1/auth/login | Public | Returns `tokenUser` and `token` |
| GET | /api/v1/auth/logout | Public | Returns logout message |

Request body:

- `POST /api/v1/auth/register`
	- `name` string, required, min 3, max 50
	- `email` valid email, required
	- `password` string, required, min 6
	- `phone` string, optional, min 7, max 15
	- `role` optional: `customer` or `seller`
- `POST /api/v1/auth/login`
	- `email` required
	- `password` required, min 6

---

## Users

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | /api/v1/users | Admin | List all users |
| DELETE | /api/v1/users/:id | Admin | Soft-deactivate user |
| PATCH | /api/v1/users/:id/approve | Admin | Approve seller account |
| GET | /api/v1/users/me | Authenticated | Current user profile |
| PATCH | /api/v1/users/update | Authenticated | Update profile and returns refreshed token |
| PATCH | /api/v1/users/update-password | Authenticated | Change password |
| GET | /api/v1/users/wishlist | Customer | List wishlist |
| POST | /api/v1/users/wishlist | Customer | Add product to wishlist via body `productId` |
| POST | /api/v1/users/add-to-wishlist | Customer | Alias endpoint for add wishlist |
| POST | /api/v1/users/wishlist/:productId | Customer | Add product to wishlist via URL param |
| DELETE | /api/v1/users/wishlist/:productId | Customer | Remove product from wishlist |
| GET | /api/v1/users/:id | Admin, Customer, Seller | Get single user |

Request body:

- `PATCH /api/v1/users/update`
	- `name`, `email`, `phone`, optional
	- `address` optional object: `street`, `city`, `state`, `country`
	- `storeName` optional (seller profile)
- `PATCH /api/v1/users/update-password`
	- `oldPassword` required
	- `newPassword` required, min 6
	- `confirmPassword` required, must match `newPassword`

---

## Products

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | /api/v1/products | Public | Supports filtering, sorting, pagination |
| GET | /api/v1/products/:id | Public | Product details |
| POST | /api/v1/products | Seller | Create product (with upload middleware) |
| PATCH | /api/v1/products/:id | Admin | Update product |
| DELETE | /api/v1/products/:id | Admin | Soft delete product |

Query parameters for `GET /api/v1/products`:

- `search` full-text match on product name (case-insensitive)
- `sort` comma-separated sort fields, example: `price,-createdAt`
- `page` page number, default `1`
- `limit` page size, default `20`, max `100`
- Supports numeric operators in filters: `gte`, `gt`, `lte`, `lt`

Request body:

- `POST /api/v1/products`
	- `name` required, min 3, max 100
	- `description` required, min 10
	- `price` required, number, minimum 15
	- `category` required (category id)
	- `images` optional array of URL strings
	- `stock` optional number, min 0
- `PATCH /api/v1/products/:id`
	- same fields optional
	- at least one field required

---

## Categories

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/v1/categories | Admin | Create category |
| GET | /api/v1/categories | Public | List categories |
| GET | /api/v1/categories/:id | Public | Category details |
| PUT | /api/v1/categories/:id | Admin | Update category |
| DELETE | /api/v1/categories/:id | Admin | Delete category |

Request body:

- `POST /api/v1/categories`
	- `name` required, min 3, max 50
	- `slug` required, lowercase string
	- `description` optional, max 500
	- `image` optional valid URL
- `PUT /api/v1/categories/:id`
	- same fields optional

---

## Cart

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/v1/cart | Authenticated | Add item to cart |
| GET | /api/v1/cart | Authenticated | Get current cart |
| PATCH | /api/v1/cart/:productId | Authenticated | Update item quantity |
| DELETE | /api/v1/cart/:productId | Authenticated | Remove item |

Request body:

- `POST /api/v1/cart`
	- `productId` required
	- `quantity` required
- `PATCH /api/v1/cart/:productId`
	- `quantity` required

---

## Checkout

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/v1/checkout | Authenticated | Creates order from current user cart |
| POST | /api/v1/checkout/guest | Public | Guest checkout without account |

Request body:

- `POST /api/v1/checkout`
	- `shippingAddress` required object: `street`, `city`, `state`, `country`, `zip`
	- `paymentMethod` required: `cash_on_delivery` or `credit_card`
	- `paymentIntentId` required only when `paymentMethod = credit_card`
- `POST /api/v1/checkout/guest`
	- `name` required
	- `email` required
	- `shippingAddress` required
	- `items` required array with `product`, `quantity`, `price`

---

## Orders

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/v1/orders | Customer | Place order |
| GET | /api/v1/orders/admin-orders | Admin | All orders |
| GET | /api/v1/orders/seller | Seller | Orders relevant to seller products |
| GET | /api/v1/orders | Customer | Current user orders |
| GET | /api/v1/orders/:id | Admin, Customer, Seller | Single order |
| PATCH | /api/v1/orders/:id | Admin, Seller, Customer | Update order status |

Request body:

- `POST /api/v1/orders`
	- `items` required array with: `product`, `quantity`, `price`
	- `shippingAddress` required object: `street`, `city`, `state`, `country`, `zip`
- `PATCH /api/v1/orders/:id`
	- `status` required: `pending`, `confirmed`, `packed`, `shipped`, `delivered`, `cancelled`

---

## Payments

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/payments/create-intent | Authenticated | Create payment intent |
| POST | /api/payments/create-checkout-session | Authenticated | Create hosted Stripe checkout session |
| POST | /api/payments/verify-session | Authenticated | Verify checkout session status |
| POST | /api/payments/confirm | Authenticated | Confirm payment intent |

Request body:

- `POST /api/payments/create-intent`
	- `amount` required number
	- `currency` optional string (default `usd`)
	- `orderId` optional
- `POST /api/payments/create-checkout-session`
	- `amount` required number
	- `currency` optional
	- `successUrl` required URL
	- `cancelUrl` required URL
- `POST /api/payments/verify-session`
	- `sessionId` required
- `POST /api/payments/confirm`
	- `paymentIntentId` required

---

## Reviews

Reviews are mounted in two route groups:

- `/api/v1/reviews`
- `/api/v1/products/:productId/reviews`

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | /api/v1/reviews | Admin | Get all reviews across products |
| GET | /api/v1/products/:productId/reviews | Public | Product reviews with pagination |
| POST | /api/v1/reviews | Customer, Seller, Admin | Create review |
| POST | /api/v1/products/:productId/reviews | Customer, Seller, Admin | Create review with product param |
| GET | /api/v1/reviews/:id | Public | Review details |
| GET | /api/v1/products/:productId/reviews/:id | Public | Review details in nested route |
| PATCH | /api/v1/reviews/:id | Customer, Seller, Admin | Owner or admin can update |
| PATCH | /api/v1/products/:productId/reviews/:id | Customer, Seller, Admin | Owner or admin can update |
| DELETE | /api/v1/reviews/:id | Customer, Seller, Admin | Owner or admin can delete |
| DELETE | /api/v1/products/:productId/reviews/:id | Customer, Seller, Admin | Owner or admin can delete |

Request body:

- `POST /api/v1/reviews` or nested variant
	- `product` optional when using nested route, otherwise required
	- `rating` required number from 1 to 5
	- `comment` required string, max 500

Query parameters for listing product reviews:

- `page` default `1`
- `limit` default `10`

---

## Notes

- Unknown routes return: `Route <url> not found`.
- Some endpoint responses use `{ status, data }` while others use resource keys like `{ order }` or `{ users }`.
- Product deletion is a soft delete (`isdeleted` is set) and hidden from product listing endpoints.

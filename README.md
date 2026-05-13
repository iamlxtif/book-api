# Books API

A RESTful API for managing a books collection, built with Node.js and Express. Supports full CRUD operations, search filtering, pagination, JWT authentication, and role-based access control.

**Live:** https://book-api-production-97b7.up.railway.app/api/books

---

## Tech Stack

- **Runtime:** Node.js 20 (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL (via `pg`)
- **Auth:** JSON Web Tokens (JWT) + bcrypt
- **Logging:** Morgan
- **Security:** Helmet, express-rate-limit
- **Deployed on:** Railway

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL running locally

### Installation

```bash
git clone https://github.com/iamlxtif/books-api
cd books-api
npm install
cp .env.example .env
```

Fill in your `.env` values (see [Environment Variables](#environment-variables)), then run migrations and start the server:

```bash
npm run migrate
npm run dev
```

The server starts at `http://localhost:3000`.

---

## Authentication

This API uses JWT Bearer token authentication.

### Flow

1. Register at `POST /api/auth/register` — receive a token
2. Log in at `POST /api/auth/login` — receive a token
3. Include the token in the `Authorization` header on protected requests:

```
Authorization: Bearer <your_token>
```

### Roles

| Role    | Permissions                          |
|---------|--------------------------------------|
| `user`  | Read all books, create, update       |
| `admin` | All of the above + delete books, access admin routes |

New users are assigned the `user` role by default.

---

## API Endpoints

### Health Check

```
GET /health
```

**Response**
```json
{
  "status": "ok",
  "timestamp": "2026-04-17T10:00:00.000Z"
}
```

---

### Auth

#### Register

```
POST /api/auth/register
```

**Request Body**

| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | string | Yes      |
| `password` | string | Yes      |
| `name`     | string | Yes      |

**Response** `201`
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "email": "user@example.com", "name": "John", "role": "user" }
}
```

---

#### Login

```
POST /api/auth/login
```

**Request Body**

| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | string | Yes      |
| `password` | string | Yes      |

**Response** `200`
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "email": "user@example.com", "name": "John", "role": "user" }
}
```

---

#### Get Current User

```
GET /api/auth/me
```

🔒 Requires valid token.

**Response** `200`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John",
  "role": "user",
  "created_at": "2026-05-01T10:00:00.000Z"
}
```

---

### Books

#### Get All Books

```
GET /api/books
```

Public — no token required.

**Query Parameters**

| Parameter | Type   | Description                      |
|-----------|--------|----------------------------------|
| `title`   | string | Filter by title (partial match)  |
| `author`  | string | Filter by author (partial match) |
| `page`    | number | Page number (default: 1)         |
| `limit`   | number | Results per page (default: 5)    |

**Response** `200`
```json
{
  "total": 1,
  "page": 1,
  "limit": 5,
  "pages": 1,
  "data": [
    {
      "id": 2,
      "title": "Clean Code",
      "author": "Robert Martin",
      "year": 2008,
      "created_by": 1
    }
  ]
}
```

---

#### Get a Single Book

```
GET /api/books/:id
```

Public — no token required.

**Response** `200`
```json
{
  "id": 1,
  "title": "The Pragmatic Programmer",
  "author": "Hunt & Thomas",
  "year": 1999,
  "created_by": null
}
```

**Not Found** `404`
```json
{ "error": "Book not found" }
```

---

#### Create a Book

```
POST /api/books
```

🔒 Requires valid token (`user` or `admin`).

**Request Body**

| Field    | Type   | Required |
|----------|--------|----------|
| `title`  | string | Yes      |
| `author` | string | Yes      |
| `year`   | number | No       |

**Response** `201`
```json
{
  "id": 3,
  "title": "You Don't Know JS",
  "author": "Kyle Simpson",
  "year": 2015,
  "created_by": 1
}
```

---

#### Update a Book

```
PUT /api/books/:id
```

🔒 Requires valid token (`user` or `admin`).

**Response** `200`
```json
{
  "id": 3,
  "title": "You Don't Know JS",
  "author": "Kyle Simpson",
  "year": 2016,
  "created_by": 1
}
```

---

#### Delete a Book

```
DELETE /api/books/:id
```

🔒 Requires valid token. **Admin only.**

**Response** `204 No Content`

---

### Admin

#### Get All Users

```
GET /api/admin/users
```

🔒 Requires valid token. **Admin only.**

**Response** `200`
```json
[
  { "id": 1, "email": "admin@example.com", "name": "Admin", "role": "admin", "created_at": "..." },
  { "id": 2, "email": "user@example.com", "name": "John", "role": "user", "created_at": "..." }
]
```

---

## Error Responses

| Status | Meaning                                      |
|--------|----------------------------------------------|
| `400`  | Validation error — missing or invalid fields |
| `401`  | No token or invalid/expired token            |
| `403`  | Authenticated but insufficient role          |
| `404`  | Resource not found                           |
| `429`  | Rate limit exceeded                          |
| `500`  | Internal server error                        |

---

## Rate Limiting

| Scope             | Limit                 |
|-------------------|-----------------------|
| All `/api` routes | 100 requests / 15 min |
| Write operations  | 20 requests / 15 min  |

Blocked requests receive `429 Too Many Requests`.

---

## Database Migrations

Migrations are plain SQL files in `migrations/` and run in order. To apply all migrations:

```bash
npm run migrate
```

| File | Description |
|------|-------------|
| `001_create_users.sql` | Users table with role and password_hash |
| `002_create_books.sql` | Books table |
| `003_...` | *(additional migrations)* |
| `005_add_created_by_to_books.sql` | Foreign key from books to users |
| `006_add_role_to_users.sql` | Role column with CHECK constraint |

---

## Project Structure

```
books-api/
├── docs/
├── migrations/
├── scripts/
│   └── migrate.js
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   └── books.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   └── book.routes.js
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   └── validators/
│   └── app.js
├── .env.example
└── package.json
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/bookstore
JWT_SECRET=your_secret_here
```

In production, these are set directly in the Railway dashboard — the `.env` file is never committed.

---

## Deployment

This API is deployed on [Railway](https://railway.app) with auto-deploy enabled on the `main` branch. Every `git push` to `main` triggers a new deployment automatically.

The production database is a Railway-managed PostgreSQL instance. Migrations run automatically on deploy.
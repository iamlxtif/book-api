# Books API

A RESTful API for managing a books collection, built with Node.js and Express. Supports full CRUD operations, search filtering, and pagination.

**Live:** https://your-app.up.railway.app

---

## Tech Stack

- **Runtime:** Node.js 20 (ES Modules)
- **Framework:** Express.js
- **Logging:** Morgan
- **Security:** Helmet, express-rate-limit
- **Deployed on:** Railway

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/iamlxtif/books-api
cd books-api
npm install
cp .env.example .env
npm run dev
```

The server starts at `http://localhost:3000`.

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

### Get All Books

```
GET /api/books
```

**Query Parameters**

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| `title`   | string | Filter by title (partial match)       |
| `author`  | string | Filter by author (partial match)      |
| `page`    | number | Page number (default: 1)              |
| `limit`   | number | Results per page (default: 5)         |

**Example Request**
```
GET /api/books?author=martin&page=1&limit=5
```

**Response**
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
      "year": 2008
    }
  ]
}
```

---

### Get a Single Book

```
GET /api/books/:id
```

**Example Request**
```
GET /api/books/1
```

**Response**
```json
{
  "id": 1,
  "title": "The Pragmatic Programmer",
  "author": "Hunt & Thomas",
  "year": 1999
}
```

**Not Found** `404`
```json
{
  "error": "Book not found"
}
```

---

### Create a Book

```
POST /api/books
```

**Request Body**

| Field    | Type   | Required | Description        |
|----------|--------|----------|--------------------|
| `title`  | string | Yes      | Title of the book  |
| `author` | string | Yes      | Author of the book |
| `year`   | number | No       | Publication year   |

**Example Request**
```json
{
  "title": "You Don't Know JS",
  "author": "Kyle Simpson",
  "year": 2015
}
```

**Response** `201`
```json
{
  "id": 3,
  "title": "You Don't Know JS",
  "author": "Kyle Simpson",
  "year": 2015
}
```

**Validation Error** `400`
```json
{
  "error": "title and author are required"
}
```

---

### Update a Book

```
PUT /api/books/:id
```

**Example Request**
```json
{
  "year": 2016
}
```

**Response**
```json
{
  "id": 3,
  "title": "You Don't Know JS",
  "author": "Kyle Simpson",
  "year": 2016
}
```

---

### Delete a Book

```
DELETE /api/books/:id
```

**Response** `204 No Content`

---

## Rate Limiting

| Scope              | Limit               |
|--------------------|---------------------|
| All `/api` routes  | 100 requests / 15 min |
| Write operations   | 20 requests / 15 min  |

Blocked requests receive `429 Too Many Requests`.

---

## Project Structure

```
books-api/
├── src/
│   ├── controllers/
│   │   └── books.controller.js
│   ├── routes/
│   │   └── books.routes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── asyncHandler.js
│   ├── config/
│   │   └── env.js
│   └── app.js
├── .env.example
├── .gitignore
├── nodemon.json
└── package.json
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

```env
PORT=3000
NODE_ENV=development
```

In production, these are set directly in the Railway dashboard — the `.env` file is never committed.

---

## Deployment

This API is deployed on [Railway](https://railway.app) with auto-deploy enabled on the `main` branch. Every `git push` to `main` triggers a new deployment automatically.

---

> **Note:** This API uses an in-memory store — data resets on every server restart. A persistent PostgreSQL database will be added in a future iteration.
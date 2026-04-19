# Database Schema

## books

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| author | VARCHAR(255) | NOT NULL |
| year | INTEGER | CHECK (1000–2100) |
| created_at | TIMESTAMP | DEFAULT NOW() |

## Indexes
- idx_books_author ON books(author)
- idx_books_year ON books(year)
# Database Schema

## books
| Column     | Type         | Constraints               |
|------------|--------------|---------------------------|
| id         | SERIAL       | PRIMARY KEY               |
| title      | VARCHAR(255) | NOT NULL                  |
| author     | VARCHAR(255) | NOT NULL                  |
| year       | INTEGER      | CHECK (1000–2100)         |
| created_at | TIMESTAMP    | DEFAULT NOW()             |
| updated_at | TIMESTAMP    | DEFAULT NOW(), auto-updated by trigger |

## Indexes
- idx_books_author ON books(author)
- idx_books_year ON books(year)
- idx_books_created_at ON books(created_at)

## Triggers
- books_updated_at: BEFORE UPDATE — sets updated_at = NOW() automatically
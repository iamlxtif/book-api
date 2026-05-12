-- Migration 005: Track which user created each book
ALTER TABLE books
  ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
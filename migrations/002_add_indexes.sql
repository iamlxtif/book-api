-- Migration 002: Add indexes for common query patterns
-- Indexes speed up WHERE and ORDER BY on these columns.
-- Always add IF NOT EXISTS — safe to re-run.

CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_year   ON books(year);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
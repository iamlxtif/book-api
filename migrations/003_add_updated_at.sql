-- Migration 003: Add updated_at column and auto-update trigger
-- This adds updated_at to the existing books table (if it doesn't already have it)
-- and creates a trigger that keeps it current automatically on every UPDATE.

-- Add the column (IF NOT EXISTS prevents an error if it already exists)
ALTER TABLE books
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create a reusable trigger function
-- OR REPLACE means this is safe to run multiple times
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the books table
-- Drop first to avoid "trigger already exists" error on re-run
DROP TRIGGER IF EXISTS books_updated_at ON books;

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
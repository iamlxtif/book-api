-- Migration 001: Create books table
-- This is the initial schema for the books table.
-- Never edit this file after it has run in any environment.

CREATE TABLE IF NOT EXISTS books (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  author     VARCHAR(255) NOT NULL,
  year       INTEGER CHECK (year BETWEEN 1000 AND 2100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
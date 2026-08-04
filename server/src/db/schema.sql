-- PostgreSQL version of the portfolio schema.
-- This file is kept for reference; the actual schema is applied
-- from db.ts using node-postgres at startup.

CREATE TABLE IF NOT EXISTS contacts (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_assets (
  id          SERIAL PRIMARY KEY,
  asset_key   TEXT NOT NULL UNIQUE,
  mime_type   TEXT NOT NULL,
  data        BYTEA NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
  id          SERIAL PRIMARY KEY,
  ip_hash     TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
  id          SERIAL PRIMARY KEY,
  page        TEXT NOT NULL DEFAULT '/',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

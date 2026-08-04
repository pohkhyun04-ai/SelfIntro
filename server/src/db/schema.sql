-- SQLite version of the portfolio schema.
-- This file is kept for reference; the actual schema is applied
-- from db.ts using better-sqlite3 at startup.

CREATE TABLE IF NOT EXISTS contacts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_assets (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_key   TEXT NOT NULL UNIQUE,
  mime_type   TEXT NOT NULL,
  data        BLOB NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

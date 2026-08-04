import pg from "pg";

const { Pool } = pg;

// Render provides DATABASE_URL as a full connection string.
// Fallback values are for local dev only.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Allow self-signed certs in dev; Render uses trusted certs.
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// ---- schema (applied once at startup) ----
const SCHEMA = `
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
`;

// ---- run schema on startup ----
pool.query(SCHEMA).catch((err) => {
  console.error("[db] Schema migration failed:", err);
  process.exit(1);
});

export default pool;

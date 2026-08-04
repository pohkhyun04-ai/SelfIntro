import initSqlJs, { type Database as SqlJsDatabase } from "sql.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- resolve DB path ----
// In dev  (tsx): __dirname = server/src/   → ../../data/ = project-root/data/
// In prod (tsc): __dirname = server/dist/  → ../../data/ = project-root/data/
const dataDir = path.resolve(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "portfolio.db");

const SCHEMA = `
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

CREATE TABLE IF NOT EXISTS likes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash     TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  page        TEXT NOT NULL DEFAULT '/',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// ---- initialise sql.js (WASM) ----
const SQL = await initSqlJs();

let db: SqlJsDatabase;
if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Apply schema (idempotent — IF NOT EXISTS)
db.run(SCHEMA);

// ---- helper: persist in-memory DB to disk ----
export function saveDb(): void {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// Persist initial schema creation
saveDb();

export default db;

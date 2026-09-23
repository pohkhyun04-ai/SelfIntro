export interface Env {
  DB: D1Database;
  AVATARS: R2Bucket;
  ADMIN_USER: string;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
  GEMINI_API_KEY: string;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export function withCors(response: Response, origin = "*"): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return new Response(response.body, { status: response.status, headers });
}

function b64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function unb64(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

async function sign(secret: string, value: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
}

export async function createToken(username: string, secret: string): Promise<string> {
  const enc = (v: unknown) => b64(new TextEncoder().encode(JSON.stringify(v)));
  const head = enc({ alg: "HS256", typ: "JWT" });
  const body = enc({ username, exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60 });
  return head + "." + body + "." + b64(new Uint8Array(await sign(secret, head + "." + body)));
}

export async function verifyToken(request: Request, secret: string): Promise<boolean> {
  const value = request.headers.get("Authorization") || "";
  if (!value.startsWith("Bearer ")) return false;
  const parts = value.slice(7).split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(unb64(parts[1]))) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    const expected = new Uint8Array(await sign(secret, parts[0] + "." + parts[1]));
    const actual = unb64(parts[2]);
    if (expected.length !== actual.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
    return diff === 0;
  } catch { return false; }
}

export async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT, message TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT, ip_hash TEXT NOT NULL UNIQUE, created_at TEXT DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, page TEXT NOT NULL DEFAULT '/', created_at TEXT DEFAULT CURRENT_TIMESTAMP)"),
  ]);
}

export async function hashIp(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return b64(bytes).slice(0, 16);
}

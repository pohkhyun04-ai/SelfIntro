import { Router, type Request, type Response } from "express";
import crypto from "node:crypto";
import pool from "../db.js";

const router = Router();

/**
 * Simple IP hasher — one-way hash so we don't store raw IPs.
 */
function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

/**
 * POST /api/like
 * Like the page. Deduplicated by IP hash — one like per visitor.
 */
router.post("/like", async (req: Request, res: Response): Promise<void> => {
  try {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const ipHash = hashIp(ip);

    // Try to insert — UNIQUE constraint prevents duplicates
    try {
      await pool.query("INSERT INTO likes (ip_hash) VALUES ($1)", [ipHash]);
    } catch {
      // Already liked by this IP — that's fine, return current count
    }

    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM likes");
    const count = rows[0].count;

    res.json({ liked: true, likes: count });
  } catch (err) {
    console.error("[stats] Failed to record like:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /api/visit
 * Record a page visit.
 */
router.post("/visit", async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = "/" } = req.body;

    await pool.query("INSERT INTO visits (page) VALUES ($1)", [page]);

    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM visits");
    const count = rows[0].count;

    res.json({ visits: count });
  } catch (err) {
    console.error("[stats] Failed to record visit:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * GET /api/stats
 * Return current like and visit counts.
 */
router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  try {
    const ip = (_req.headers["x-forwarded-for"] as string) || _req.socket.remoteAddress || "unknown";
    const ipHash = hashIp(ip);

    const [likeResult, visitResult, hasLikedResult] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM likes"),
      pool.query("SELECT COUNT(*)::int AS count FROM visits"),
      pool.query("SELECT COUNT(*)::int AS count FROM likes WHERE ip_hash = $1", [ipHash]),
    ]);

    res.json({
      likes: likeResult.rows[0].count,
      visits: visitResult.rows[0].count,
      hasLiked: hasLikedResult.rows[0].count > 0,
    });
  } catch (err) {
    console.error("[stats] Failed to fetch stats:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;

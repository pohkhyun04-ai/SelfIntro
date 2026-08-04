import { Router, type Request, type Response } from "express";
import crypto from "node:crypto";
import db, { saveDb } from "../db.js";

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
router.post("/like", (req: Request, res: Response): void => {
  try {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const ipHash = hashIp(ip);

    // Try to insert — UNIQUE constraint prevents duplicates
    try {
      db.run("INSERT INTO likes (ip_hash) VALUES (?)", [ipHash]);
      saveDb();
    } catch {
      // Already liked by this IP — that's fine, return current count
    }

    const result = db.exec("SELECT COUNT(*) as count FROM likes");
    const count = result[0].values[0][0] as number;

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
router.post("/visit", (req: Request, res: Response): void => {
  try {
    const { page = "/" } = req.body;

    db.run("INSERT INTO visits (page) VALUES (?)", [page]);
    saveDb();

    const result = db.exec("SELECT COUNT(*) as count FROM visits");
    const count = result[0].values[0][0] as number;

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
router.get("/stats", (_req: Request, res: Response): void => {
  try {
    const ip = (_req.headers["x-forwarded-for"] as string) || _req.socket.remoteAddress || "unknown";
    const ipHash = hashIp(ip);
    const likeResult = db.exec("SELECT COUNT(*) as count FROM likes");
    const visitResult = db.exec("SELECT COUNT(*) as count FROM visits");

    const hasLikedResult = db.exec("SELECT COUNT(*) as count FROM likes WHERE ip_hash = ?", [ipHash]);

    res.json({
      likes: likeResult[0].values[0][0],
      visits: visitResult[0].values[0][0],
      hasLiked: (hasLikedResult[0].values[0][0] as number) > 0,
    });
  } catch (err) {
    console.error("[stats] Failed to fetch stats:", err);
    res.status(500).json({ error: "Internal server error." });
  }
  
});

export default router;

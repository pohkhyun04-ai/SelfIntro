import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

// All routes in this file require a valid JWT.
router.use(authMiddleware);

router.get("/contacts", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC",
    );

    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;

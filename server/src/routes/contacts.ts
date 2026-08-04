import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import db from "../db.js";

const router = Router();

// All routes in this file require a valid JWT.
router.use(authMiddleware);

router.get("/contacts", async (_req: Request, res: Response): Promise<void> => {
  try {
    const results = db.exec(
      "SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC",
    );

    if (results.length === 0) {
      res.json([]);
      return;
    }

    const { columns, values } = results[0];
    const rows = values.map((row: unknown[]) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col: string, i: number) => {
        obj[col] = row[i];
      });
      return obj;
    });

    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;

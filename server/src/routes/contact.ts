import { Router, type Request, type Response } from "express";
import type { ResultSetHeader } from "mysql2";
import pool from "../db.js";

const router = Router();

router.post("/contact", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !message) {
      res.status(400).json({ error: "Name and message are required." });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email ?? null, message],
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Failed to save contact message:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;

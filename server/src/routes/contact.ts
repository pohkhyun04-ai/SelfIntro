import { Router, type Request, type Response } from "express";
import db, { saveDb } from "../db.js";

const router = Router();

router.post("/contact", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !message) {
      res.status(400).json({ error: "Name and message are required." });
      return;
    }

    db.run(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email ?? null, message],
    );

    // Retrieve the auto-generated id
    const idResult = db.exec("SELECT last_insert_rowid()");
    const insertId = idResult[0].values[0][0] as number;

    saveDb();

    res.status(201).json({ success: true, id: insertId });
  } catch (err) {
    console.error("Failed to save contact message:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;

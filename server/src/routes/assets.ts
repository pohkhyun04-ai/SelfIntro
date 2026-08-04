import { Router, type Request, type Response } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

// multer stores the uploaded file in memory as a Buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// GET /api/avatar  (public — anyone can fetch the avatar)
router.get("/avatar", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query(
      "SELECT mime_type, data FROM site_assets WHERE asset_key = 'chatbot_avatar'",
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "No avatar found." });
      return;
    }

    const { mime_type, data } = rows[0];

    // Tell the browser this is an image
    res.setHeader("Content-Type", mime_type);
    res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1 hour
    res.send(data); // pg returns BYTEA as Buffer
  } catch (err) {
    console.error("[assets] fetch error:", err);
    res.status(500).json({ error: "Failed to fetch avatar." });
  }
});

// POST /api/assets/avatar  (admin only — needs JWT)
router.post(
  "/assets/avatar",
  authMiddleware,
  upload.single("file"), // "file" is the form field name
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded." });
        return;
      }

      // Only allow images
      if (!file.mimetype.startsWith("image/")) {
        res.status(400).json({ error: "Only image files are allowed." });
        return;
      }

      // UPSERT: INSERT ... ON CONFLICT (PostgreSQL syntax)
      await pool.query(
        `INSERT INTO site_assets (asset_key, mime_type, data)
         VALUES ('chatbot_avatar', $1, $2)
         ON CONFLICT (asset_key) DO UPDATE SET
           mime_type = excluded.mime_type,
           data      = excluded.data,
           updated_at = CURRENT_TIMESTAMP`,
        [file.mimetype, file.buffer],
      );

      res.json({ success: true, message: "Avatar uploaded." });
    } catch (err) {
      console.error("[assets] upload error:", err);
      res.status(500).json({ error: "Upload failed." });
    }
  },
);

export default router;

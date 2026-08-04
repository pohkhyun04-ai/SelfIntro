import { Router, type Request, type Response } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import db, { saveDb } from "../db.js";

const router = Router();

// multer stores the uploaded file in memory as a Buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// GET /api/avatar  (public — anyone can fetch the avatar)
router.get("/avatar", async (_req: Request, res: Response): Promise<void> => {
  try {
    const results = db.exec(
      "SELECT mime_type, data FROM site_assets WHERE asset_key = 'chatbot_avatar'",
    );

    if (results.length === 0 || results[0].values.length === 0) {
      res.status(404).json({ error: "No avatar found." });
      return;
    }

    const [mime_type, data] = results[0].values[0];

    // Tell the browser this is an image
    res.setHeader("Content-Type", mime_type as string);
    res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1 hour
    res.send(Buffer.from(data as Uint8Array)); // send raw bytes
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

      // UPSERT: INSERT OR REPLACE via ON CONFLICT (SQLite syntax)
      db.run(
        `INSERT INTO site_assets (asset_key, mime_type, data)
         VALUES ('chatbot_avatar', ?, ?)
         ON CONFLICT(asset_key) DO UPDATE SET
           mime_type = excluded.mime_type,
           data      = excluded.data,
           updated_at = CURRENT_TIMESTAMP`,
        [file.mimetype, file.buffer],
      );

      saveDb();

      res.json({ success: true, message: "Avatar uploaded." });
    } catch (err) {
      console.error("[assets] upload error:", err);
      res.status(500).json({ error: "Upload failed." });
    }
  },
);

export default router;

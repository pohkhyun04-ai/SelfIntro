import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import contactRouter from "./routes/contact.js";
import authRouter from "./routes/auth.js";
import contactsRouter from "./routes/contacts.js";
import chatRouter from "./routes/chat.js";
import assetsRouter from "./routes/assets.js";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
// Render sets PORT automatically; SERVER_PORT is a fallback for local dev
const PORT = Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 3001;

// ---- middleware ----
app.use(cors());
app.use(express.json());

// ---- routes ----
// NOTE: public routes must come before protected ones because
// contactsRouter applies authMiddleware globally via router.use().
app.use("/api", contactRouter);   // POST /api/contact  (public)
app.use("/api", authRouter);      // POST /api/login    (public)
app.use("/api", chatRouter);      // POST /api/chat     (public, Gemini FAQ)
app.use("/api", assetsRouter);    // POST /api/assets/avatar (protected), GET /api/avatar (public)
app.use("/api", statsRouter);     // POST /api/like, POST /api/visit, GET /api/stats (public)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", contactsRouter);  // GET  /api/contacts (protected)

// ---- serve frontend in production ----
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // In dev (tsx): __dirname = server/src/  → ../../dist = project-root/dist/
  // In prod (tsc): __dirname = server/dist/ → ../../dist = project-root/dist/
  const clientDist = path.resolve(__dirname, "../../dist");

  console.log(`[server] __dirname = ${__dirname}`);
  console.log(`[server] clientDist = ${clientDist}`);
  console.log(`[server] clientDist exists = ${fs.existsSync(clientDist)}`);
  if (fs.existsSync(clientDist)) {
    console.log(`[server] dist contents: ${fs.readdirSync(clientDist).join(", ")}`);
  }

  // Debug endpoint — check what files exist in the dist directory
  app.get("/api/debug/static", (_req, res) => {
    if (!fs.existsSync(clientDist)) {
      res.json({ error: "clientDist does not exist", path: clientDist });
      return;
    }
    const listDir = (dir: string): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      return entries.flatMap((e) => {
        const full = path.join(dir, e.name);
        return e.isDirectory() ? listDir(full) : [full];
      });
    };
    res.json({ clientDist, files: listDir(clientDist) });
  });

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(clientDist));

  // SPA fallback — return index.html for any route that isn't /api/*
  app.use("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    const indexPath = path.join(clientDist, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`[server] index.html not found at ${indexPath}`);
      res.status(500).send(`index.html not found at ${indexPath}`);
    }
  });
}

// ---- start ----
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRouter from "./routes/contact.js";
import authRouter from "./routes/auth.js";
import contactsRouter from "./routes/contacts.js";
import chatRouter from "./routes/chat.js";
import assetsRouter from "./routes/assets.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.SERVER_PORT) || 3001;

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

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", contactsRouter);  // GET  /api/contacts (protected)

// ---- start ----
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

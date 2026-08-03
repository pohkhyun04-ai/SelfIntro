import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req: Request, res: Response): void => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USER || "qia";
  const adminPass = process.env.ADMIN_PASSWORD || "123123";
  const jwtSecret = process.env.JWT_SECRET || "fallback-secret";

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  if (username !== adminUser || password !== adminPass) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  const token = jwt.sign({ username } satisfies { username: string }, jwtSecret, {
    expiresIn: "8h",
  });

  res.json({ token });
});

export default router;

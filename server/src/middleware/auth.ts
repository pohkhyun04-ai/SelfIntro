import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  username: string;
}

/**
 * Express middleware — rejects requests that lack a valid JWT.
 * On success the decoded payload is attached to `req.auth`.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header." });
    return;
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET || "fallback-secret";

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as any).auth = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

import { env } from "../config/env.js";
export function verifyCronSecret(req, res, next) {
  const secret = req.headers["x-cron-secret"];

  if (!secret) {
    return res.status(401).json({
      message: "Missing cron secret",
    });
  }

  if (secret !== env.CRON_SECRET) {
    return res.status(401).json({
      message: "Invalid cron secret",
    });
  }

  next();
}

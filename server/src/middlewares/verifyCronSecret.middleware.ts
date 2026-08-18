import { env } from "../config/env.js";
import {Request, Response, NextFunction} from 'express'
export function verifyCronSecret(req: Request, res: Response, next:NextFunction) {
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

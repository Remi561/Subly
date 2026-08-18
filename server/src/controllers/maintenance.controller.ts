import { sendExpired } from "../jobs/sendExpired.js";
import { sendReminder } from "../jobs/sendReminder.js";
import { syncRate } from "../jobs/syncRate.js";
import {Request, Response, NextFunction} from 'express'


export async function jobsMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await Promise.allSettled([
      syncRate(),
      sendReminder(),
      sendExpired(),
    ]);

    return res.json({
      message: "Maintainance completed",
      results,
    });
  } catch (err) {
    console.log(`Maintenance Error: ${err}`)
    next(err);
  }
}

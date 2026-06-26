import { sendExpired } from "../jobs/sendExpired.js";
import { sendReminder } from "../jobs/sendReminder.js";
import { syncRate } from "../jobs/syncRate.js";


export async function jobsMaintenance(req, res, next) {
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
    next(err);
  }
}

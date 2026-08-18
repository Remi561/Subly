import express, { Response, Request, NextFunction } from 'express';
import { env } from "./config/env.js";

import cookieParser from "cookie-parser";
import { subscriptionRouter } from "./routes/subs.route.js";
import { requireAuth } from "./middlewares/requireAuth.middleware.js";

import {
  apiLimiter,
  authLimiter,
} from "./middlewares/rateLimiter.middleware.js";
import { adminRouter } from "./routes/admin.route.js";
import { requireAdmin } from "./middlewares/requireAdmin.middleware.js";
import { meRouter } from "./routes/me.route.js";

import { currencyRouters } from "./routes/rate.route.js";
import { historyRouter } from "./routes/history.route.js";
import cors from "cors";
import { notificationRouter } from "./routes/notification.route.js";
import { jobsMaintenanceRouter } from "./routes/maintenance.route.js";
import {clerkMiddleware, getAuth} from '@clerk/express'
import {webHooksRouter} from './routes/webhooks.route.js'




const app = express()

app.use(express.json())

app.use(clerkMiddleware())




const normalizeOrigin = (origin: string| undefined) => origin?.trim().replace(/\/$/, "");

const configuredOrigins = [
  env.CLIENT_URL,
  ...(env.CORS_ORIGINS ? env.CORS_ORIGINS.split(",") : []),
]
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  ...configuredOrigins,
]);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (!allowedOrigins.has(normalizedOrigin)) {
        const msg = `CORS blocked origin: ${origin}.`;
        return callback(new Error(msg), false);
      }

      return callback(null, normalizedOrigin);
    },
    credentials: true, // Crucial if you are passing JWT cookies back and forth!
  }),
);


app.use(cookieParser());


// apis


app.use("/api/me", requireAuth, meRouter);
app.use("/api/jobs", jobsMaintenanceRouter);
app.use("/api/rate", currencyRouters);

app.use("/api/subscription", requireAuth, subscriptionRouter);
app.use("/api/history", requireAuth, historyRouter);
app.use("/api/admin", apiLimiter, requireAuth, requireAdmin, adminRouter);
app.use("/api/notification", requireAuth, notificationRouter);

app.use('/api/webhooks', express.raw({ type: 'application/json' }), webHooksRouter)

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
// Starting the server 

app.listen(env.PORT, (error) => {
  if (error) {
    console.log(`Something went wrong ${error}`);
    return;
  }
  console.log(`Server is running on port ${env.PORT}`);
});

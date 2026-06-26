import express from 'express';
import { env } from "./src/config/env.js";
import { authRouter } from './src/routes/auth.route.js';
import cookieParser from "cookie-parser";
import { subscriptionRouter } from "./src/routes/subs.route.js";
import { requireAuth } from "./src/middlewares/requireAuth.middleware.js";
import {
  apiLimiter,
  authLimiter,
} from "./src/middlewares/rateLimiter.middleware.js";
import { adminRouter } from "./src/routes/admin.route.js";
import { requireRole } from "./src/middlewares/requireRole.middleware.js";
import { meRouter } from "./src/routes/me.route.js";
import { refreshRouter } from "./src/routes/refresh.route.js";
import { currencyRouters } from "./src/routes/rate.route.js";
import { historyRouter } from "./src/routes/history.route.js";
import cors from "cors";
import { notificationRouter } from "./src/routes/notification.route.js";
import { jobsMaintenanceRouter } from "./src/routes/maintenance.route.js";



const app = express()




const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");

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
        const msg = `CORS blocked origin: ${origin}. Add it to CLIENT_URL or CORS_ORIGINS.`;
        return callback(new Error(msg), false);
      }

      return callback(null, normalizedOrigin);
    },
    credentials: true, // Crucial if you are passing JWT cookies back and forth!
  }),
);

app.use(express.json())
app.use(cookieParser());


// apis

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/me", requireAuth, meRouter);
app.use("/api/jobs", jobsMaintenanceRouter);
app.use("/api/rate", currencyRouters);
app.use("/api/refresh", apiLimiter, refreshRouter);
app.use("/api/subscription", requireAuth, subscriptionRouter);
app.use("/api/history", requireAuth, historyRouter);
app.use("/api/admin", apiLimiter, requireAuth, requireRole, adminRouter);
app.use("/api/notification", requireAuth, notificationRouter);

app.use((err, req, res, next) => {
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

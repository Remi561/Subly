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



const app = express()

app.use(express.json())
app.use(cookieParser());


// apis

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/me", requireAuth, meRouter);
app.use("/api/rate", currencyRouters);
app.use("/api/refresh", apiLimiter, refreshRouter);

app.use("/api/subscription", requireAuth, subscriptionRouter);
app.use("/api/admin", apiLimiter, requireAuth, requireRole, adminRouter);

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
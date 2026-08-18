import rateLimiter from "express-rate-limit";

export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many request, Try again later",
  },
});

export const apiLimiter = rateLimiter({
  windowMs: 20 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    message: "Too many request, Try again later",
  },
});

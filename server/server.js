import express from 'express';
import { env } from "./src/config/env.js";
import { authRouter } from './src/routes/auth.route.js';
import cookieParser from "cookie-parser";
import { subscriptionRouter } from "./src/routes/subs.route.js";
import { requireAuth } from "./src/middlewares/requireAuth.middleware.js";



const app = express()

app.use(express.json())
app.use(cookieParser());


// apis

app.use('/api/auth', authRouter)
app.use("/api/subscription", requireAuth, subscriptionRouter);

app.use((err, req, res, next) => {
  if (err) {
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
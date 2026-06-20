import { getMe } from "../controllers/me.controller.js";
import { Router } from "express";

export const meRouter = Router();

meRouter.get("/", getMe);

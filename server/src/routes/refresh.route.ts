import { refreshToken } from "../controllers/refresh.controller.js";
import { Router } from "express";

export const refreshRouter = Router()

refreshRouter.post("/", refreshToken)
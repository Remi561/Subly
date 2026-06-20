import { Router } from "express";
import { demoteUser, getAdminStats, getAllUsers, promoteUser } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.get('/stats', getAdminStats)
adminRouter.get('/users', getAllUsers)
adminRouter.patch('/promote/:id', promoteUser)
adminRouter.patch('/demote/:id', demoteUser)


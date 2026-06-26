
import express from 'express'
import { jobsMaintenance } from "../controllers/maintenance.controller.js";
import { verifyCronSecret } from "../middlewares/verifyCronSecret.middleware.js";


export const jobsMaintenanceRouter = express.Router();

jobsMaintenanceRouter.post("/maintenance", verifyCronSecret, jobsMaintenance);
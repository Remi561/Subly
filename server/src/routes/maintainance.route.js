
import express from 'express'
import { jobsMaintainance } from '../controllers/maintainance.controller.js';


export const jobsMaintainanceRouter = express.Router();

jobsMaintainanceRouter.post('/maintainance', jobsMaintainance)
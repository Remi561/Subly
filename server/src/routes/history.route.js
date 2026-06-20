import express from 'express'
import { getFilteredHistory } from '../controllers/history.controller.js';

export const historyRouter = express.Router();

historyRouter.get('/', getFilteredHistory)
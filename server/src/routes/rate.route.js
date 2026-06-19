import { Router } from 'express'
import { getRate } from '../controllers/rate.controller.js';

export const currencyRouters = Router()

currencyRouters.get('/', getRate);
import express from 'express';
import {webHooks} from '../controllers/webHooks.controller.js'

export const webHooksRouter = express.Router();

webHooksRouter.post('/', webHooks)


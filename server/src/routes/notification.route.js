import express from 'express'
import { getNotification, deleteNotification } from '../controllers/notification.controller.js';

export const notificationRouter = express.Router();

notificationRouter.get('/', getNotification)
notificationRouter.delete('/delete/:id', deleteNotification)
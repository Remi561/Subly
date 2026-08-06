import { prisma } from "../libs/prisma.js"
import {Response, Request, NextFunction} from 'express'
export async function getNotification(req: Request, res: Response, next: NextFunction) {
    try { 
        const userId = req.user.id
     
        const notifications = await prisma.notification.findMany({
            where: {
                userId
            }
        })

        return res.json({data: notifications, count:notifications.length , message: 'notification fetched successfully '})

    }
    catch (err) {
        console.error(`Get Notification Error: ${err}`)
        next(err)
    }
}

export async function deleteNotification(req: Request, res:Response, next:NextFunction) {
    try {
        const userId = req.user.id;

        const id = req.params.id;

        if(Array.isArray(id)){
            return res.status(400).json({message: 'Invalid Notification id'})
        }

        const results = await prisma.notification.deleteMany({
            where:{
                userId,
                id
            }
        })

        if(results.count === 0){
            return res.status(404).json({message: 'Notifiaction do not exist'})
        }

        return res.status(200).json({
          message: "Notification deleted successfully",
        });
    } catch (err) {
        console.error(`Delete Notification Error: ${err}`)
        next(err)
    }
}
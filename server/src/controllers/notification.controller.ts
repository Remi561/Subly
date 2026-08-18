import { prisma } from "../libs/prisma.js"
import {Response, Request, NextFunction} from 'express'
import {getAuth }from '@clerk/express'
export async function getNotification(req: Request, res: Response, next: NextFunction) {
    try { 
        const {userId: clerkId} = getAuth(req)

        
        if(!clerkId){
            return res.status(401).json({message: 'Access denied'})
        }
        const notifications = await prisma.notification.findMany({
            where: {
                user: {
                    clerkId
                }
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
        const {userId: clerkId} = getAuth(req);

        if(!clerkId){
            return res.status(401).json({message: 'Access denied'})
        }

        const id = req.params.id;

        if(Array.isArray(id)){
            return res.status(400).json({message: 'Invalid Notification id'})
        }

        const results = await prisma.notification.deleteMany({
            where:{
                user: {
                    clerkId
                },
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

import  {Request, Response, NextFunction} from 'express'
import {getAuth }from '@clerk/express'
import {prisma }from '../libs/prisma.js'

export async function getMe(req: Request, res: Response, next: NextFunction) {

    try {
       
   
        const {userId: clerkId} = getAuth(req);
        
        if(!clerkId){
          return res.status(401).json({message: 'Access denied'})
        }

        const user = await prisma.user.findUnique({
          where: {
            clerkId
          }
        })

        if(!user){
          return res.status(404).json({message: 'User not found'})
        }

        return res.json({
          message: "User information retrieved successfully", 
          user:{
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username, 
            email: user.email,
            role: user.role, 
            baseCurrency: user.baseCurrency,
            reminderDaysBefore: user.reminderDaysBefore,
            emailVerified: user.emailVerified,
            emailNotificationEnabled: user.emailNofiticationEnabled,
            createdAt: user.createdAt,
          } 
        });

    } catch (err) {
        console.error(`Me error: ${err}`)
        next(err);
     }
}
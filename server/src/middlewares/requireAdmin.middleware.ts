import {Request, Response, NextFunction} from 'express'
import {prisma} from '../libs/prisma.js'
import {getAuth }from '@clerk/express'
export async function requireAdmin(req:Request, res: Response, next:NextFunction) {

    try {
        const { userId: clerkId} = getAuth(req);

    if(!clerkId){
        return res.status(401).json({message: "Unauthorized"})
    }

    const user = await prisma.user.findFirst({
        where: {
            clerkId
        }
    })
    
    if (!user) {
       return res.status(404).json({message: 'User is not found'})
    }
    if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Forbidden: Admin access only" });
    }

    next()
    } catch(err){
        console.error(`Authorization error: ${err}`)
        next(err)
    }
    
}
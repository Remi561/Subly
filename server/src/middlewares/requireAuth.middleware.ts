import {Response, Request, NextFunction} from 'express'
import {getAuth} from '@clerk/express'

import {env} from '../config/env.js'
export async function requireAuth(req: Request, res: Response, next: NextFunction) {

    try {
      const {isAuthenticated } = getAuth(req)

     
      if(!isAuthenticated){
        return res.status(401).json({message: "Unauthorized"})
      }
      
      next()
    } catch (err) {
      console.error(`Authentication error: ${err}`)
        return res.status(401).json({
          message: "Invalid or expired token",
        });
    }


}
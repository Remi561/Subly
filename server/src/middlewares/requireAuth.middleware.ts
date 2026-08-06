import {Response, Request, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {env} from '../config/env.js'
export async function requireAuth(req: Request, res: Response, next: NextFunction) {

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
  
    try {
        const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next()
    } catch (err) {
        return res.status(401).json({
          message: "Invalid or expired token",
        });
    }


}
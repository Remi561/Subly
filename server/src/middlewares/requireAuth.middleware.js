import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';
export async function requireAuth(req, res, next) {

    const authHeader = req.headers.authorization || req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = authHeader.split(" ")[1];

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
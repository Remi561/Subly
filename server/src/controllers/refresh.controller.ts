import  jwt  from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../libs/prisma.js";
import {Response, NextFunction, Request} from 'express'


export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    let decoded

    try {
      decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
  
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }
    
    const decodedId = typeof decoded === 'object' && decoded !== null ? decoded.id : null;
    if (!decodedId) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedId,
      },
      select: {
        id: true,
        username: true,
        role: true,
        baseCurrency: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }
     // create new access token
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        baseCurrency: user.baseCurrency,
      },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    return res.status(200).json({
      message: "New access token successfully created",
      
    });
    
  } catch (err) {
    console.error(`Error refreshing token: ${err}`);
    next(err);
  }
}
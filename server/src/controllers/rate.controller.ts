import { prisma } from "../libs/prisma.js";
import {Response, Request, NextFunction} from 'express'
export async function getRate(req: Request, res: Response, next: NextFunction) {

    try {
        const rateDb = await prisma.rates.findUnique({
          where: {
            baseCurrency: "EUR",
          },
        });

        if (!rateDb) {
            return res.status(404).json({message: "Rate not found"})
        }

        return res.json({ message: "Rate found successfully", rates:rateDb.rates})
    } catch (err) {
        console.error(`Rate Error: ${err}`)
        next(err)
    }
}

import { prisma } from "../libs/prisma.js";
export async function getRate(req, res, next) {

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
        next(err)
    }
}

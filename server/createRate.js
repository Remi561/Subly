import { prisma } from "./src/libs/prisma.js";
import axios from "axios";

async function createRate(baseCurrency="USD") {
    try {
        const response = await axios.get(
          "https://api.frankfurter.dev/v2/rates",
        );
        const data = response.data
        const baseCurrency = data[0].base;
        const date = data[0].date;

        const rates = data.reduce((acc, item) => {
          acc[item.quote] = item.rate;
          return acc;
        }, {});

        // Add the base currency itself
        rates[baseCurrency] = 1;
        
        await prisma.rates.upsert({
          where: {
            baseCurrency
          },
          update: {
            rates
          },
          create: {
            baseCurrency,
            rates
          },
        });

        console.log('inserted sucessfully')
        return
     } catch (err) {
        console.error(err)
        throw new Error('Something went wrong')
    }
}

createRate()
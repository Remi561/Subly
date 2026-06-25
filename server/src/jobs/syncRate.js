import { prisma } from "../libs/prisma.js";

import axios from 'axios';

export async function syncRate() {
  const response = await axios.get(
    "https://api.exchangerate-api.com/v4/latest/EUR",
  );

  await prisma.rates.upsert({
    where: {
      baseCurrency: "EUR",
    },
    update: {
      rates: response.data.rates,
    },
    create: {
      baseCurrency: "EUR",
      rates: response.data.rates,
    },
  });
}


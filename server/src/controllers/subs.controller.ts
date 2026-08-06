import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionIdParamSchema,
  RenewSubscriptionSchemas,
} from "../libs/validated.js";
import { prisma } from "../libs/prisma.js";
import {
  generatedSettledAmt,
  getLink,
  getNextBillingDate,
} from "../libs/utils.js";

import { Request, Response, NextFunction } from "express";
import {Prisma} from '../generated/prisma/client.js'
import { Rate } from "../types/global.js";

// GET request
export async function getSubscriptions(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const data = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "subscription not found" });
    }
    return res.json({ success: true, message: "Subscription found", data });
  } catch (err) {
    console.error(`Error getting subscriptions: ${err}`);
    next(err);
    // return res.status(500).json({success: false,message:"something went wrong" })
  }
}
export async function getSubscriptionById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const id = req.params.id as string;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        id,
      },
    });

    if (!subscription) {
      return res.status(404).json({ message: "subscription not found" });
    }
    return res.json({ message: "subscription found", data: subscription });
  } catch (err) {
    console.error(`Error getting subscription by id: ${err}`);
    next(err);
  }
}
export async function getPaginatedSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const currentPage = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string;
    const itemsPerPage = 10;
    const user = req.user;

    // 1. Build the base query (always filter by the logged-in user)
    const whereClause: { userId: string, OR?:[{ name: { contains: string, mode: "insensitive" } }] } = {
      userId: user.id,
    };

    // 2. Only add the OR search block if the user actually typed a search term
    if (search) {
      whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    // 3. Run the transaction using the shared whereClause
    const [subscriptions, totalCount] = await prisma.$transaction([
      // Query A: Get the paginated data
      prisma.subscription.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc", // Newest to oldest
        },
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      }),

      // Query B: Get the total count for the frontend pagination UI
      prisma.subscription.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return res.json({
      subscriptions,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
      },
    });
  } catch (err) {
    console.error(`Error getting paginated subscriptions: ${err}`);
    next(err);
  }
}

export async function getSubscriptionsInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;

    const [amountResult, totalActiveSub, totalExpiredSub, totalSubs] =
      await Promise.all([
        prisma.subscription.aggregate({
          where: { userId: user.id, status: "ACTIVE" },
          _sum: { settledAmount: true },
        }),
        prisma.subscription.count({
          where: { userId: user.id, status: "ACTIVE" },
        }),
        prisma.subscription.count({
          where: { userId: user.id, status: "EXPIRED" },
        }),
        prisma.subscription.count({
          where: { userId: user.id },
        }),
      ]);

    // 2. Safely extract the number from the Prisma object.
    // The `|| 0` ensures that if they have 0 active subs, it returns 0 instead of null.
    const totalAmount = amountResult._sum.settledAmount || 0;

    res.json({
      message: "Information gotten successfully",
      totalAmount, // Now this is a clean, reliable number
      totalActiveSub,
      totalExpiredSub,
      totalSubs,
    });
  } catch (err) {
    console.error(`Error getting subscriptions info: ${err}`);
    next(err);
  }
}

export async function getSubscriptionExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start at the beginning of that month

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        settledAmount: true,
        createdAt: true,
      },
    });

    const chartMap = new Map();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      const label = d.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });

      chartMap.set(label, 0);
    }

    subscriptions.forEach((sub) => {
      const date = new Date(sub.createdAt);
      const label = date.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });

      if (chartMap.has(label)) {
        const currentSum = chartMap.get(label);
        chartMap.set(label, currentSum + Number(sub.settledAmount));
      }
    });

    const formattedChartData = Array.from(chartMap, ([month, total]) => ({
      month,
      total,
    }));

    return res.status(200).json(formattedChartData);
  } catch (error) {
    console.error(`Error getting subscription expenses: ${error}`);
    next(error);
  }
}


export async function getSpendingByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    // 1. Group subscriptions by category and sum up the settled amounts
    const categorySums = await prisma.subscription.groupBy({
      by: ["category"],
      where: {
        userId: userId,
        status: { not: "ARCHIVED" }, // Optional: exclude archived accounts
      },
      _sum: {
        settledAmount: true, // Summing up amounts normalized to base currency
      },
    });

    // 2. Calculate the absolute Grand Total of all spending combined
    const grandTotal = categorySums.reduce((acc, item) => {
      return acc + Number(item._sum.settledAmount || 0);
    }, 0);

    if (grandTotal === 0) {
      return res.status(200).json([]);
    }

    const formattedPieData = categorySums.map((item) => {
      const amount = Number(item._sum.settledAmount || 0);

      const percentage = Math.round((amount / grandTotal) * 100 * 10) / 10;

      return {
        id: item.category,

        category: item.category.replace(/_/g, " ").toLowerCase(),
        amount: amount,
        percentage: percentage,
      };
    });

    formattedPieData.sort((a, b) => b.amount - a.amount);

    return res
      .status(200)
      .json({ grandTotal, categoryTotal: formattedPieData });
  } catch (error) {
    console.error(`Error getting spending by category: ${error}`);
    next(error);
  }
}

// POST, PATCH, DELETE request

export async function createSubscriptions(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const parsedBody = CreateSubscriptionSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        errors: parsedBody.error.flatten().fieldErrors,
        message: "Invalid input",
      });
    }

    const { billingCycle, currency, amount, category } = parsedBody.data;
    const name = parsedBody.data.name.toLowerCase().trim();

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        AND: {
          userId: user.id,
          name,
        },
      },
    });

    if (existingSubscription) {
      return res.status(400).json({ message: "Subscription already exist" });
    }

    const currencies = await prisma.rates.findUnique({
      where: {
        baseCurrency: "EUR",
      },
    });

    if (!currencies) {
      return res.status(404).json({ message: "Currency rate not available" });
    }
    const rates = currencies.rates as Record<string, number>;
    const baseCurrency: string = user.baseCurrency;
    if (!rates[currency] || !rates[baseCurrency]) {
      return res.status(400).json({ message: "Currency not supported" });
    }

    const linkToSite = await getLink(name);
    const nextBillingDate = getNextBillingDate(billingCycle);
    const paidAmount = Math.round(amount * 100);
    const { exchangeRate, settledAmt } = await generatedSettledAmt(
      currency,
      user.baseCurrency,
      amount,
      rates,
    );

    const subscription = await prisma.$transaction(async (tx) => {
      const createdSubscription = await tx.subscription.create({
        data: {
          userId: user.id,
          name,
          linkToSite,
          category,
          amount: paidAmount,
          currency,
          exchangeRate,
          settledAmount: settledAmt,
          billingCycle,
          nextBillingDate,
        },
      });

      await tx.history.create({
        data: {
          subscriptionName: createdSubscription.name,
          category: createdSubscription.category,
          paidAmount: createdSubscription.amount,
          paidCurrency: createdSubscription.currency,
          baseCurrency: user.baseCurrency,
          exchangeRate: createdSubscription.exchangeRate,
          settledAmount: createdSubscription.settledAmount,
          type: 'CREATED',
          userId: user.id
        }
      })

      

      return createdSubscription;
    });

    res.status(201).json({ subscription });
  } catch (err) {
    next(err);
  }
}

export async function deleteSubscriptionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if(typeof id !== "string"){
      throw new Error('Id should only be the type string')
    }

    const parsedBody = SubscriptionIdParamSchema.safeParse({ id });

    if (!parsedBody.success) {
      return res.status(400).json({ message: "Unsupported Id" });
    }

    const user = req.user;

    // To give a better message rather than something went wrong
  
    const result = await prisma.subscription.deleteMany({
      where:{
        userId: user.id,
        id
      }
    })

    if(!result.count){
      return res.status(404).json({message: 'The subscription you are trying to delete is not found'})
    }


    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    console.error(`Error deleting Subscription: ${err}`)
    next(err);
  }
}

export async function editSubscriptionById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const id = req.params.id;
    const baseCurrency = user.baseCurrency.toUpperCase();

    const parsedId = SubscriptionIdParamSchema.safeParse({ id });

    if (!parsedId.success) {
      return res.status(400).json({
        errors: parsedId.error.flatten().fieldErrors,
        message: "Unsupported Id",
      });
    }

    const parsedBody = UpdateSubscriptionSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        errors: parsedBody.error.flatten().fieldErrors,
        message: "Invalid input",
      });
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        id: parsedId.data.id,
      },
    });

    if (!existingSubscription) {
      return res.status(404).json({
        message: `The subscription with the id ${parsedId.data.id} is not found`,
      });
    }

    const { name, amount, currency, billingCycle, category } = parsedBody.data;

  const updateData:Prisma.SubscriptionUpdateInput = {};

    if (name !== undefined) {
      const normalizedName = name.toLowerCase().trim();

      //Look for all other subscription name
      const existingName = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          name: normalizedName,
          NOT: {
            id: existingSubscription.id,
          },
        },
      });

      if (existingName) {
        return res.status(400).json({
          message: "This subscription name already exists",
        });
      }


      const linkToSite = await getLink(normalizedName)

      updateData.name = normalizedName;
      updateData.linkToSite = linkToSite;
    }

    if (amount !== undefined || currency !== undefined) {
      const currencyRates = await prisma.rates.findFirst({
        where: {
          baseCurrency: "EUR",
        },
      });

      if (!currencyRates) {
        return res.status(404).json({
          message: "Currency rates not found",
        });
      }

      const rates = currencyRates.rates as Rate;

     
      const finalCurrency = currency
        ? currency.toUpperCase()
        : existingSubscription.currency;

      const finalAmount = amount !== undefined ? amount : Number(existingSubscription.amount) / 100;

      

      if (!rates[baseCurrency] || !rates[finalCurrency]) {
        return res.status(400).json({
          message: "Unsupported currency",
        });
      }

      const { exchangeRate, settledAmt } = await generatedSettledAmt(
        finalCurrency,
        baseCurrency,
        finalAmount,
        rates,
      );

      updateData.amount = Math.round(finalAmount * 100);
      updateData.currency = finalCurrency;
      updateData.settledAmount = settledAmt;
      updateData.exchangeRate = exchangeRate;
    }

    if (billingCycle !== undefined) {
      const nextBillingDate = getNextBillingDate(billingCycle);

      updateData.billingCycle = billingCycle;
      updateData.nextBillingDate = nextBillingDate;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    

    const updatedSubscription = await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.update({
        where: {
          id: existingSubscription.id,
        },
        data: updateData,
      });
      await tx.history.create({
        data: {
          
         subscriptionName: subscription.name,
         category: subscription.category,
         paidAmount: subscription.amount,
         paidCurrency: subscription.currency,
         exchangeRate: subscription.exchangeRate,
         settledAmount: subscription.settledAmount,
         type: "EDITED",
         baseCurrency,
         userId: user.id

        },
      
      });
    });

    return res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (err) {
    console.error(`Edit Subscription Error: ${err}`)
    next(err);
  }
}

export async function renewSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const id = req.params.id as string;

    const parsedId = SubscriptionIdParamSchema.safeParse({ id });
    const parsedBody = RenewSubscriptionSchemas.safeParse(req.body);

    if (!parsedId.success) {
      return res.status(400).json({
        errors: parsedId.error.flatten().fieldErrors,
        message: "Invalid id",
      });
    }
    if (!parsedBody.success) {
      return res.status(400).json({
        errors: parsedBody.error.flatten().fieldErrors,
        message: "Invalid input",
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        id,
      },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (!["EXPIRED", "ARCHIVED"].includes(subscription.status)) {
      return res.status(400).json({
        message: "Only expired and archived subscription can be renewed",
      });
    }

    const { amount, currency, billingCycle } = parsedBody.data;

    const currencies = await prisma.rates.findUnique({
      where: {
        baseCurrency: "EUR",
      },
    });

    if (!currencies) {
      return res.status(500).json({ message: "Currency rate not available" });
    }

    const rates = currencies.rates as Rate;
    const baseCurrency = user.baseCurrency;
    if (!rates[currency] || !rates[baseCurrency]) {
      return res.status(400).json({ message: "Currency not supported" });
    }

    const nextBillingDate = getNextBillingDate(billingCycle);
    const paidAmount = Math.round(amount * 100);
    const { exchangeRate, settledAmt } = await generatedSettledAmt(
      currency,
      baseCurrency,
      amount,
      rates,
    );

    const updatedSubscription = await prisma.$transaction(async (tx) => {
      await tx.history.create({
        data: {
          userId: user.id,
          subscriptionName: subscription.name,
         
          paidAmount,
          paidCurrency: currency,
          baseCurrency,
          exchangeRate,
          type: "RENEWED",
          category: subscription.category,
          settledAmount: settledAmt,
        },
      });

     return await tx.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          amount: paidAmount,
          currency,
          exchangeRate,
          settledAmount: settledAmt,
          billingCycle,
          nextBillingDate,
          status: "ACTIVE",
        },
      });
     

     
    });

    return res.status(200).json({
      message: "Subscription renewed successfully",
      subscription: updatedSubscription,
    });
  } catch (err) {
    console.error(`Renew Error: ${err}`)
    next(err);
  }
}

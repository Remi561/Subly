import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionIdParamSchema,
  RenewSubscriptionSchemas,
} from "../libs/validated.js";
import { prisma } from "../libs/prisma.js";
import {
  generatedSettledAmt,
  getLogo,
  getNextBillingDate,
} from "../libs/utils.js";

// GET request
export async function getSubscriptions(req, res, next) {
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
    next(err);
    // return res.status(500).json({success: false,message:"something went wrong" })
  }
}
export async function getSubscriptionById(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id;

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
    next(err);
  }
}
export async function getPaginatedSubscription(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const itemsPerPage = 10;
    const user = req.user;

    // 1. Build the base query (always filter by the logged-in user)
    const whereClause = {
      userId: user.id,
    };

    // 2. Only add the OR search block if the user actually typed a search term
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },

        // Reminder: If 'status' is an Enum in your Prisma schema,
        // 'contains' will throw an error here. It must be a String field!
      ];
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
    next(err);
  }
}

export async function getSubscriptionsInfo(req, res, next) {
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
    next(err);
  }
}

export async function getSubscriptionExpenses(req, res, next) {
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
    next(error);
  }
}

export async function getSpendingByCategory(req, res, next) {
  try {
    const userId = req.user.id;

    return res.json({ userId });
  } catch (err) {
    next(err);
  }
}

// POST, PATCH, DELETE request

export async function createSubscriptions(req, res, next) {
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
      return res.status(500).json({ message: "Currency rate not available" });
    }
    const rates = currencies.rates;
    const baseCurrency = user.baseCurrency;
    if (!rates[currency] || !rates[baseCurrency]) {
      return res.status(400).json({ message: "Currency not supported" });
    }

    const logoUrl = await getLogo(name);
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
          logoUrl,
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
          subscriptionId: createdSubscription.id,

          subscriptionName: createdSubscription.name,
          subscriptionLogoUrl: createdSubscription.logoUrl,

          paidAmount: paidAmount,
          paidCurrency: currency,

          baseCurrency,
          category: createdSubscription.category,
          exchangeRate,
          settledAmount: settledAmt,

          paidAt: new Date(),
        },
      });

      return createdSubscription;
    });

    res.status(201).json({ subscription });
  } catch (err) {
    next(err);
  }
}

export async function deleteSubscriptionById(req, res, next) {
  try {
    const { id } = req.params;

    const parsedBody = SubscriptionIdParamSchema.safeParse({ id });

    if (!parsedBody.success) {
      return res.status(400).json({ message: "Unsupported Id" });
    }

    const user = req.user;

    // To give a better message rather than something went wrong
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await prisma.subscription.delete({
      where: {
        id: subscription.id,
      },
    });

    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function editSubscriptionById(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id;

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

    const updateData = {};

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

      const logoUrl = await getLogo(normalizedName);

      updateData.name = normalizedName;
      updateData.logoUrl = logoUrl;
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

      const rates = currencyRates.rates;

      const finalCurrency = currency
        ? currency.toUpperCase()
        : existingSubscription.currency;

      const finalAmount =
        amount !== undefined ? amount : existingSubscription.amount / 100;

      const baseCurrency = user.baseCurrency.toUpperCase();

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

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: existingSubscription.id,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (err) {
    next(err);
  }
}

export async function renewSubscription(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id;

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
    const rates = currencies.rates;
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
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          subscriptionLogoUrl: subscription.logoUrl,
          paidAmount,
          paidCurrency: currency,
          baseCurrency,
          exchangeRate,
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
    next(err);
  }
}

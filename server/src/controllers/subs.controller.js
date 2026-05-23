import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionIdParamSchema,
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

    console.log(user);
    const logoUrl = await getLogo(name);
    const nextBillingDate = getNextBillingDate(billingCycle);
    const { exchangeRate, settledAmt } = await generatedSettledAmt(
      currency,
      user.baseCurrency,
      amount,
      rates,
    );

    await prisma.subscription.create({
      data: {
        userId: user.id,
        name,
        logoUrl,
        category,
        amount,
        currency,
        exchangeRate,
        settledAmount: settledAmt,
        billingCycle,
        nextBillingDate,
      },
    });
    res.json({ logoUrl, nextBillingDate, settledAmt, category, name });
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
        amount !== undefined
          ? Number(amount)
          : existingSubscription.amount / 100;

      const baseCurrency = user.baseCurrency.toUpperCase();

      if (!rates[baseCurrency] || !rates[finalCurrency]) {
        return res.status(400).json({
          message: "Unsupported currency",
        });
      }

      const { exchangeRate, settledAmount } = generatedSettledAmt(
        finalCurrency,
        baseCurrency,
        finalAmount,
        rates,
      );

      updateData.amount = Math.round(finalAmount * 100);
      updateData.currency = finalCurrency;
      updateData.settledAmount = settledAmount;
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

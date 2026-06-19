import { url } from "zod";
import z from "zod";

export const RegisterSchemas = z.object({
  name: z
    .string({ error: "This input must be string" })
    .min(3, { error: "Must be atleast 3 characters" })
    .max(16, { error: "Must be atmost 16 characters" }),
  email: z.email({ error: "Invalid email" }),
  username: z
    .string()
    .min(3, { error: "Must be atleast 3 characters long" })
    .max(16, { error: "Must be atmost 16 characters" })
    .regex(/[A-Z]/, { error: "Must contain atleast one uppercase " })
    .regex(/[0-9]/, { error: "Must contain atleast one number" })
    .regex(/[^A-Za-z0-9]/, {
      error: "Must contain atleast one special character",
    }),
  password: z
    .string({ error: "Must contain a letter" })
    .min(8, { error: "Must be 8 characters long" })
    .max(128, { error: "Must be within 16 character" })
    .regex(/[A-Z]/, { error: "Must contain atleast one uppercase " })
    .regex(/[0-9]/, { error: "Must contain atleast one number" })
    .regex(/[^A-Za-z0-9]/, {
      error: "Must contain atleast one special character",
    }),

  baseCurrency: z
    .string({ error: "Must be a letter" })
    .trim()
    .length(3, { error: "Must not be more than 3" })
    .transform((value) => value.toUpperCase()),
});

export const LoginSchemas = RegisterSchemas.omit({
  name: true,
  username: true,
  baseCurrency: true,
});

const currencySchema = z
  .string()
  .trim()
  .length(3, "Currency must be a 3-letter currency code")
  .regex(/^[A-Za-z]{3}$/, "Currency must contain only letters")
  .transform((value) => value.toUpperCase());

const amountSchema = z.coerce
  .number({
    invalid_type_error: "Amount must be a number",
  })
  .positive("Amount must be greater than 0")
  .max(9999999999.99, "Amount is too large");

const billingCycleSchema = z.enum(["WEEKLY", "MONTHLY", "YEARLY"], {
  message: "Billing cycle must be WEEKLY, MONTHLY, or YEARLY",
});

const statusSchema = z.enum(["ACTIVE", "EXPIRED", "CANCELLED", "ARCHIVED"], {
  message: "Invalid subscription status",
});

const categorySchema = z.enum([
  "ENTERTAINMENT",
  "PRODUCTIVITY",
  "SOFTWARE",
  "STORAGE",
  "EDUCATION",
  "AI_TOOLS",
  "OTHER",
]);

export const CreateSubscriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subscription name must be at least 2 characters")
    .max(50, "Subscription name must not exceed 50 characters"),

  logoUrl: z
    .string()
    .trim()
    .url("Logo must be a valid URL")
    .optional()
    .or(z.literal("")),

  amount: amountSchema,

  currency: currencySchema,

  billingCycle: billingCycleSchema.default("MONTHLY"),

  nextBillingDate: z.coerce
    .date({
      invalid_type_error: "Next billing date must be a valid date",
    })
    .refine((date) => date > new Date(), {
      message: "Next billing date must be in the future",
    })
    .optional(),

  category: categorySchema.default("OTHER").optional(),
});

export const UpdateSubscriptionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Subscription name must be at least 2 characters")
      .max(50, "Subscription name must not exceed 50 characters")
      .optional(),

    logoUrl: z
      .string()
      .trim()
      .url("Logo must be a valid URL")
      .optional()
      .or(z.literal("")),

    amount: amountSchema.optional(),

    currency: currencySchema.optional(),

    billingCycle: billingCycleSchema.optional(),

    status: statusSchema.optional(),

    nextBillingDate: z.coerce
      .date({
        invalid_type_error: "Next billing date must be a valid date",
      })
      .optional(),

    category: categorySchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export const SubscriptionIdParamSchema = z.object({
  id: z.string().cuid("Invalid subscription ID"),
});

export const SubscriptionQuerySchema = z.object({
  status: statusSchema.optional(),

  billingCycle: billingCycleSchema.optional(),

  search: z.string().trim().max(50, "Search query is too long").optional(),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const RenewSubscriptionSchemas = z.object({
  amount: amountSchema,
  currency: currencySchema,
  billingCycle: billingCycleSchema,
});
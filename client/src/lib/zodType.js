import { z } from "zod";

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
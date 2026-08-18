
import { z } from "zod";

export const RegisterSchemas = z
  .object({
    firstName: z
      .string({ error: "This input must be string" })
      .min(3, { error: "Must be atleast 3 characters" })
      .max(16, { error: "Must be atmost 16 characters" }),
    lastName: z
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
    confirmPassword: z.string({ error: "Please confirm your password" }),
    baseCurrency: z
      .string({ error: "Must be a letter" })
      .trim()
      .length(3, { error: "Must not be more than 3" })
      .transform((value) => value.toUpperCase()),
  }).refine((data) => data.confirmPassword === data.password, {
    error: 'Password does not match',
    path: ['confirmPassword']
  } )
 

export const LoginSchemas = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
      .string({ error: "Must contain a letter" })
      .min(8, { error: "Must be 8 characters long" })
      .max(128, { error: "Must be within 16 character" })
      .regex(/[A-Z]/, { error: "Must contain atleast one uppercase " })
      .regex(/[0-9]/, { error: "Must contain atleast one number" })
      .regex(/[^A-Za-z0-9]/, {
        error: "Must contain atleast one special character",
      }),
})

export const CodeSchemas = z.object({
  code: z.coerce.number({
    error: "This Input must be a number"
  })
})
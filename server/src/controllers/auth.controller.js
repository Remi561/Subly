import { RegisterSchemas, LoginSchemas } from "../libs/validated.js";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma.js";
import argon2 from "argon2";
import { env } from "../config/env.js";
import { en } from "zod/v4/locales";

export async function register(req, res, next) {
  // const {name,email, username, password, baseCurrency} = req.body
  try {
    const parsedBody = RegisterSchemas.safeParse(req.body);
    const currencies = await prisma.rates.findUnique({
      where: {
        baseCurrency: "EUR",
      },
    });

    const supportedCurrencies = Object.keys(currencies.rates);

    if (!parsedBody.success) {
      return res.status(400).json({
        errors: parsedBody.error.flatten().fieldErrors,
        message: "Invalid Form Input",
      });
    }
    const { password, name, baseCurrency } = parsedBody.data;
    const email = parsedBody.data.email.toLowerCase().trim();
    const username = parsedBody.data.username.toLowerCase().trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ errors: null, message: "Email or username already exist" });
    }

    if (!supportedCurrencies.includes(baseCurrency)) {
      return res.status(400).json({ message: "Unsupported currency" });
    }

    const hashedPassword = await argon2.hash(password.trim(), {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 1,
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        baseCurrency,
      },
    });

    // creating a session

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        baseCurrency: user.baseCurrency,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(201).json({
      message: "Account Created",

    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const parsedBody = LoginSchemas.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        errors: parsedBody.error.flatten().fieldErrors,
        message: "Invalid input",
      });
    }

    const email = parsedBody.data.email.toLowerCase().trim();
    const password = parsedBody.data.password;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isCorrectPassword = await argon2.verify(user.password, password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // All information valid, create session

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        baseCurrency: user.baseCurrency,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({ message: "Login successfully" });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ message: "logout successfully" });
  } catch (err) {
    next(err);
  }
}

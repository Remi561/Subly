import { RegisterSchemas, LoginSchemas } from "../libs/validated.js";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma.js";
import argon2 from "argon2";
import { env } from "../config/env.js";

export async function register(req, res, next) {
  // const {name,email, username, password, baseCurrency} = req.body
  try {
    const parsedBody = RegisterSchemas.safeParse(req.body);
    const supportedCurrencies = ["NGN", "USD", "EUR", "GBP", "CAD", "JPY"];
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
        username: user.username,
        role: user.role,
      },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    return res.status(201).json({
      message: "Account Created",
      accessToken,
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
        username: user.username,
        role: user.role,
      },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    return res.json({ message: "Login successfully", accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "logout successfully" });
  } catch (err) {
    next(err);
  }
}

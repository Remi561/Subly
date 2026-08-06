import { RegisterSchemas, LoginSchemas } from "../libs/validated.js";
import {Request, Response, NextFunction} from 'express'
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma.js";
import argon2 from "argon2";
import { env } from "../config/env.js";
import  {Currencies, User} from '../types/global.js'

// helper function 

const createRefreshToken = (id: string): string => {
  return jwt.sign(
    {
      id: id,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
}

const createAccessToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      baseCurrency: user.baseCurrency,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
}


export async function register(req: Request, res: Response, next: NextFunction) {
  // const {name,email, username, password, baseCurrency} = req.body
  try {
    const parsedBody = RegisterSchemas.safeParse(req.body);
    const currencies = await prisma.rates.findUniqueOrThrow({
      where: {
        baseCurrency: "EUR",
      },
    });

    if(!currencies.rates){
      throw new Error('rates is not avaliable')
    }

    

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

    const refreshToken = createRefreshToken(user.id)

    const accessToken = createAccessToken(user)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(201).json({
      message: "Account Created",

    });
  } catch (err) {
    console.error(`Register error ${err}`)
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
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
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isCorrectPassword = await argon2.verify(user.password, password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // All information valid, create session

    const refreshToken = createRefreshToken(user.id)

    const accessToken = createAccessToken(user)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({ message: "Login successfully" });
  } catch (err) {
    console.error(`Login error ${err}`)
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'none',
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'none',
    });

    res.json({ message: "logout successfully" });
  } catch (err) {
    console.error(`Logout error: ${err}`)
    next(err);
  }
}

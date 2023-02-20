import { Request, Response, NextFunction } from "express";
import {
  getUserByEmail,
  getUserByUsername,
  getUserForLogin,
} from "../../db/User";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

export async function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const err: ResponseError = new Error(
        "Must include a valid username, email and password"
      );
      err.status = 400;
      throw err;
    }

    let maybeUser = await getUserByUsername(username);

    if (maybeUser) {
      const err: ResponseError = new Error(
        "A user with that username already exists."
      );
      err.status = 422;
      throw err;
    }

    maybeUser = await getUserByEmail(email);

    if (maybeUser) {
      const err: ResponseError = new Error(
        "A user with that email already exists."
      );
      err.status = 422;
      throw err;
    }

    if (password.length < 8) {
      const err: ResponseError = new Error(
        "Password must be between 8 and 20 characters."
      );
      err.status = 422;
      throw err;
    }

    if (username.lenth < 3 || username.length > 20) {
      const err: ResponseError = new Error(
        "Username must be between 3 and 20 characters"
      );
      err.status = 422;
      throw err;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const user: User | null = await getUserForLogin(email);

    if (!email || !password) {
      const err: ResponseError = new Error(
        "Please enter a valid username and password."
      );
      err.status = 400;
      throw err;
    }

    if (!user) {
      const err: ResponseError = new Error("Invalid username or password.");
      err.status = 422;
      throw err;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      const err: ResponseError = new Error("Invalid username or password.");
      err.status = 422;
      throw err;
    }
    next();
  } catch (error) {
    next(error);
  }
}

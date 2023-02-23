import { User } from "@prisma/client";
import express, { Router, Request, Response, NextFunction } from "express";
import { createUser, getMe, getUserForLogin } from "../../../db/User";
import { validateRegister, validateLogin } from "../../util/errorHandlers";

import * as jwt from "jsonwebtoken";
import { requireUser } from "../../util/requireUser";

const authRotuer: Router = express.Router();

//GET /api/v1/auth/health
authRotuer.get(
  "/health",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({
      ok: true,
      message: "All connected at /api/v1/auth/health",
    });
  }
);

// POST /api/v1/auth/register

authRotuer.post(
  "/register",
  validateRegister,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      const newUser: User = await createUser({ username, email, password });

      res.send({
        ok: true,
        message: "Success! Please login to acces your new account.",
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/auth/login

authRotuer.post(
  "/login",
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user: User | null = await getUserForLogin(email);

      const SECRET_KEY: jwt.Secret = `${process.env.JWT_SECRET}`;

      if (user) {
        const userInfo: UserAllInfo | null = await getMe(user.id);

        const access_token = jwt.sign(user.id, SECRET_KEY);

        res.cookie("access_token", access_token, {
          httpOnly: true,
          sameSite: "strict",
        });

        res.send({
          ok: true,
          user: userInfo,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

//  GET /api/v1/auth/logout
authRotuer.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token");
    res.send({
      ok: true,
      message: "Successfully logged out!",
    });
  }
);

// GET /api/v1/auth/me -> requireUser

authRotuer.get(
  "/me",
  requireUser,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const me: UserAllInfo | null = await getMe(req.user.id);
      res.send({
        ok: true,
        user: me,
      });
    }
  }
);

// DELETE /api/auth/v1/me -> requireUser

// PATCH /api/auth/v1/me -> requireUser

export default authRotuer;

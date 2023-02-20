import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getServerOwner, userIsMember } from "../../db/Server";
import { getUserById } from "../../db/User";

//TODO:
// Need the following middleware functions for controlling access to API endpoints

// requireUser -> ensures that a user is signed in
export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string = req.cookies["access_token"];

    if (!token) {
      const err: ResponseError = new Error("You must sign in first.");
      err.status = 401;
      throw err;
    }
    const SECRET_KEY: jwt.Secret = `${process.env.JWT_SECRET}`;
    const data: string = jwt.verify(token, SECRET_KEY) as string;

    console.log(typeof data);

    const user = await getUserById(data);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// requireAccess -> ensures that the signedin user is a member of a server
export async function requireAcces(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.user) {
      const hasAccess = await userIsMember(req.user.id, req.params.serverId);
      if (hasAccess) {
        return next();
      }
    }

    const err: ResponseError = new Error(
      "You must belong to this server to access it."
    );
    err.status = 403;
    throw err;
  } catch (error) {
    next(error);
  }
}

// requirePermissions -> for creating/deleteing channels, adding/kicking members
export async function requirePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {}

//requireOwner -> reserved for actions only a server owner can make,
// like deleting a server

export async function requireOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.user) {
      const owner = await getServerOwner(req.params.serverId);
      if (owner) {
        if (owner.userId == req.user.id) {
          next();
        }
      }
    }
    const err: ResponseError = new Error(
      "You must belong to this server to access it."
    );
    err.status = 403;
    throw err;
  } catch (error) {
    next(error);
  }
}

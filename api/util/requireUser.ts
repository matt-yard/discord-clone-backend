import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getChannelById, getServerByChannelId } from "../../db/Channel";
import { getServerById, getServerOwner, userIsMember } from "../../db/Server";
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

    console.log(req.cookies);
    if (!token) {
      const err: ResponseError = new Error("You must sign in first.");
      err.status = 401;
      throw err;
    }
    const SECRET_KEY: jwt.Secret = `${process.env.JWT_SECRET}`;
    const data: string = jwt.verify(token, SECRET_KEY) as string;

    console.log(typeof data);

    const user = await getUserById(data);
    console.log("user, ", user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// requireAccess -> ensures that the signedin user is a member of a server, will work with
// channelId param or serverId param
export async function requireAcces(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let serverId = req.params.serverId;

    if (!serverId) {
      let channelId = req.params.channelId;
      if (!channelId) {
        const err: ResponseError = new Error("Could not find resource.");
        err.status = 404;
        throw err;
      }
      let channel = await getServerByChannelId(channelId);
      if (channel) {
        serverId = channel;
      } else {
        const err: ResponseError = new Error("Could not find resource.");
        err.status = 404;
        throw err;
      }
    }
    const maybeServer = await getServerById(req.params.serverId);
    if (!maybeServer) {
      const err: ResponseError = new Error(
        "Could not find a server with that ID."
      );
      err.status = 404;
      throw err;
    }

    if (req.user?.id) {
      const hasAccess = await userIsMember(req.user.id, req.params.serverId);
      if (hasAccess) {
        next();
      } else {
        const err: ResponseError = new Error(
          "You must belong to this server to access it."
        );
        err.status = 403;
        throw err;
      }
    }
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
    let serverID = req.params.serverId;

    if (!serverID) {
      let channelId = req.params.channelId;
      if (!channelId) {
        const err: ResponseError = new Error("Could not find resource.");
        err.status = 404;
        throw err;
      }
      const maybeServerId = await getServerByChannelId(channelId);

      if (maybeServerId) {
        serverID = maybeServerId;
      } else {
        const err: ResponseError = new Error("Could not find resource.");
        err.status = 404;
        throw err;
      }
    }

    if (req.user) {
      const owner = await getServerOwner(req.params.serverId);
      // console.log("the owner?", owner);
      if (owner) {
        if (owner.userId == req.user.id) {
          console.log("they matching?");
          next();
        } else {
          const err: ResponseError = new Error(
            "You dont have permission to do that."
          );
          err.status = 403;
          throw err;
        }
      }
    }
  } catch (error) {
    next(error);
  }
}

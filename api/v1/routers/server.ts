import { Server } from "@prisma/client";
import express, { Router, Request, Response, NextFunction } from "express";
import { createChannel } from "../../../db/Channel";
import {
  addMemberByUsername,
  addMemberToServer,
  createNewServer,
  deleteServer,
  getServerById,
  updateServer,
  userIsMember,
} from "../../../db/Server";
import { getUserByUsername } from "../../../db/User";
import {
  requireAcces,
  requireOwner,
  requireUser,
} from "../../util/requireUser";

const serverRouter: Router = express.Router();

//GET /api/v1/server/health
serverRouter.get(
  "/health",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({
      ok: true,
      message: "All connected at /api/v1/server/health",
    });
  }
);

//POST /api/v1/server -> requireUser

serverRouter.post(
  "/",
  requireUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, serverImage } = req.body;
      if (!name) {
        const err: ResponseError = new Error("Missing name.");
        err.status = 400;
        throw err;
      }

      if (req.user) {
        const newServerFields: ServerCreateFields = {
          name: name,
        };
        if (serverImage) {
          newServerFields.serverImage = serverImage;
        }

        const newServer = await createNewServer(newServerFields, req.user.id);
        res.send({
          ok: true,
          server: newServer,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/servers/:serverId -> requireAcces

serverRouter.get(
  "/:serverId",
  requireUser,
  requireAcces,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const selectedServer: (Server & ServerAllInfo) | null =
        await getServerById(req.params.serverId);

      if (!selectedServer) {
        const err: ResponseError = new Error("Server not found");
        err.status = 404;
        throw err;
      }

      res.send({
        ok: true,
        server: selectedServer,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/servers/:serverId -> requirePermission
// for now, updates to servers can only come from the owner...

serverRouter.patch(
  "/:serverId",
  requireUser,
  requireOwner,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, serverImage } = req.body;
      const serverUpdateFields: ServerUpdateFields = {};

      if (name) serverUpdateFields.name = name;
      if (serverImage) serverUpdateFields.serverImage = serverImage;

      const updatedServer: Server = await updateServer(
        req.params.serverId,
        serverUpdateFields
      );

      res.send({
        ok: true,
        server: updatedServer,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/servers/:serverId -> requireServerOwner

serverRouter.delete(
  "/:serverId",
  requireUser,
  requireOwner,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedServer = await deleteServer(req.params.serverId);
      res.send({
        ok: true,
        server: deletedServer,
      });
    } catch (error) {
      next(error);
    }
  }
);

//POST /api/v1/servers/:serverId/channels
// Creating a new channel in a server
serverRouter.post(
  "/:serverId/channels",
  requireUser,
  requireOwner,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type } = req.body;
      if (!name || !type) {
        const err: ResponseError = new Error(
          "Must include a name and type for a new channel."
        );
        err.status = 400;
        throw err;
      }

      const newChannel = await createChannel({
        name,
        type,
        serverId: req.params.serverId,
      });

      res.send({
        ok: true,
        channel: newChannel,
      });
    } catch (error) {
      next(error);
    }
  }
);

serverRouter.post(
  "/:serverId/add-member",
  requireUser,
  requireOwner,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body;
      console.log("username", username);
      if (!username) {
        const err: ResponseError = new Error("Must provide a username");
        err.status = 400;
        throw err;
      }
      const userToAdd: UserPublicInfo | null = await getUserByUsername(
        username
      );

      console.log("user to add", userToAdd);
      if (!userToAdd) {
        const err: ResponseError = new Error("Could not find user");
        err.status = 404;
        throw err;
      } else {
        const isMember = await userIsMember(userToAdd.id, req.params.serverId);

        console.log("ismember, ", isMember);
        if (isMember) {
          res.send({
            ok: true,
            message: "User already belongs to the server.",
          });
        } else {
          await addMemberToServer(userToAdd.id, req.params.serverId);
          res.send({
            ok: true,
            message: "User has been added!",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

export default serverRouter;

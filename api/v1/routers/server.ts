import { Server } from "@prisma/client";
import express, { Router, Request, Response, NextFunction } from "express";
import { createChannel } from "../../../db/Channel";
import {
  createNewServer,
  deleteServer,
  getServerById,
  updateServer,
} from "../../../db/Server";
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

//POST /api/v1/servers -> requireUser

serverRouter.post(
  "/servers",
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
          ownerId: req.user?.id,
        };
        if (serverImage) {
          newServerFields.serverImage = serverImage;
        }

        const newServer = await createNewServer(newServerFields);
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

export default serverRouter;

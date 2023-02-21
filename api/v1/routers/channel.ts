import { Channel } from "@prisma/client";
import express, { Router, Request, Response, NextFunction } from "express";
import {
  deleteChannel,
  getChannelById,
  updateChannelName,
} from "../../../db/Channel";
import {
  requireAcces,
  requireOwner,
  requireUser,
} from "../../util/requireUser";

const channelRouter: Router = express.Router();

//GET /api/v1/server/health
channelRouter.get(
  "/health",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({
      ok: true,
      message: "All connected at /api/v1/channel/health",
    });
  }
);

// GET /api/v1/channels/:chanelId -> requireAccess
channelRouter.get(
  "/:channelId",
  requireUser,
  requireAcces,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const channelInfo = await getChannelById(req.params.channelId);

      res.send({
        ok: true,
        channel: channelInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/channels/:channelId -> requireOwner
channelRouter.delete(
  "/:channelId",
  requireUser,
  requireOwner,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedChannel = await deleteChannel(req.params.channelId);
      res.send({
        ok: true,
        channel: deletedChannel,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/channels/:channelId -> requirePermission
channelRouter.patch(
  "/:channelID",
  requireUser,
  requireOwner,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      if (!name) {
        const err: ResponseError = new Error(
          "Must provide a new name for channel"
        );
        err.status = 400;
        throw err;
      }

      const newChannel: Channel = await updateChannelName(
        name,
        req.params.channelId
      );

      res.send({
        ok: true,
        channel: newChannel,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/channels/:channelId/send-message -> requireAccess
// will need function to determine if the user sending a message, is
// a member of the server

//UPDATE -> may not need a post route for sending messages, since it will be done
// via websockets

export default channelRouter;

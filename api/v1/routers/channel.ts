import express, { Router, Request, Response, NextFunction } from "express";

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

// DELETE /api/v1/channels/:channelId -> requirePermission

// PATCH /api/v1/channels/:channelId -> requirePermission

// POST /api/v1/channels/:channelId/send-message -> requireAccess
// will need function to determine if the user sending a message, is
// a member of the server

export default channelRouter;

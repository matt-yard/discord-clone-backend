import express, { Router, Request, Response, NextFunction } from "express";

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

// GET /api/v1/servers/:serverId -> requireAcces

// PATCH /api/v1/servers/:serverId -> requirePermission

// DELETE /api/v1/servers/:serverId -> requireServerOwner

// POST /api/v1/servers/:serverId/channels

export default serverRouter;

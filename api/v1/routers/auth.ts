import express, { Router, Request, Response, NextFunction } from "express";

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

// POST /api/v1/auth/login

// GET /api/v1/auth/me -> requireUser

// DELETE /api/auth/v1/me -> requireUser

// PATCH /api/auth/v1/me -> requireUser

export default authRotuer;

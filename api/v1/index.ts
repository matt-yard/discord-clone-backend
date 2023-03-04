import express, { Router, Request, Response, NextFunction } from "express";
import authRotuer from "./routers/auth";
import channelRouter from "./routers/channel";
import serverRouter from "./routers/server";

const v1Router: Router = express.Router();

v1Router.get(
  "/test",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({
      ok: true,
      message: "Hello world!",
    });
  }
);

v1Router.use("/auth", authRotuer);
v1Router.use("/server", serverRouter);
v1Router.use("/channel", channelRouter);

export default v1Router;

import express, { Express, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import apiRouter from "./api";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
// express middleware

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//routes

app.use("/api", apiRouter);

// Error handling

app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
      ok: false,
      error: {
        message: err.message,
        status: err.status || 500,
      },
    });
  }
);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});

export default app;

import express, { Express, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Success! TS Express is working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});

export default app;

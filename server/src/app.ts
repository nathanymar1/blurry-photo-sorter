import express, { Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests, please try again later."
});

app.use(
  cors({
    origin: "http://blurry-photo-sorter-app.s3-website-us-east-1.amazonaws.com"
  })
);
app.use(express.json());
app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;

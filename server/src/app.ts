import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://blurry-photo-sorter-app.s3-website-us-east-1.amazonaws.com"
  })
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;

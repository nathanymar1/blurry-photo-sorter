import "dotenv/config";
import app from "./app.js";
import imageRouter from "./routes/imageRoutes.js";

const port = process.env.PORT || 3000;

app.use("/images", imageRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

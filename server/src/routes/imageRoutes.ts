/*
  Implements image API routes.
*/

import { Router } from "express";
import multer from "multer";
import {
  listImages,
  downloadImages,
  deleteImages,
  deleteImage,
  classifyImages,
  uploadImagesFromBrowser
} from "../controllers/imageController.js";

const imageRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

imageRouter.get("/", listImages);
imageRouter.get("/download", downloadImages);
imageRouter.post("/classify", classifyImages);
imageRouter.post("/upload", upload.array("images"), uploadImagesFromBrowser);
imageRouter.delete("/:key", deleteImage);
imageRouter.delete("/", deleteImages);
imageRouter.post("/clear", deleteImages);

export default imageRouter;

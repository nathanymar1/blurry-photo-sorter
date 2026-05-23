/*
  Handles upload, list, download, delete, and classify routes.
  Upload files uses multer to upload browser images to S3 client.
*/

import { Request, Response } from "express";
import {
  listImagesInBucket,
  downloadImagesFromBucket,
  emptyBucket,
  deleteImageFromBucket,
  uploadImageFromBuffer
} from "../services/s3Service.js";
import { classifyImage } from "../services/classifierService.js";
import { convertToJpeg } from "../services/imageService.js";

const BUCKET = process.env.S3_BUCKET_NAME!;

export const listImages = async (req: Request, res: Response) => {
  try {
    await listImagesInBucket({ bucketName: BUCKET });
    res.json({ message: "Listed images successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not list images.", error: err });
  }
};

export const downloadImages = async (req: Request, res: Response) => {
  try {
    const { downloadPath } = req.query as { downloadPath: string };
    await downloadImagesFromBucket({ bucketName: BUCKET, downloadPath });
    res.json({ message: "Images downloaded successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not download images.", error: err });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const key = req.params.key as string;
    await deleteImageFromBucket({ bucketName: BUCKET, key });
    res.json({ message: "Image deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete image.", error: err });
  }
};

export const deleteImages = async (req: Request, res: Response) => {
  try {
    await emptyBucket({ bucketName: BUCKET });
    res.json({ message: "Images deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete images.", error: err });
  }
};

export const classifyImages = async (req: Request, res: Response) => {
  try {
    const images = await listImagesInBucket({ bucketName: BUCKET });
    if (!images || images.length === 0) {
      console.log("Bucket is empty");
      return;
    }

    const sharp: {
      label: number;
      confidence: number;
      filename: string;
      url: string;
    }[] = [];
    const blur: {
      label: number;
      confidence: number;
      filename: string;
      url: string;
    }[] = [];
    for (const image of images) {
      if (!image.Key) continue;
      const prediction = await classifyImage({
        bucketName: BUCKET,
        key: image.Key
      });

      // classify
      if (prediction.label === 1) {
        sharp.push(prediction);
      } else {
        blur.push(prediction);
      }
    }
    res.json({
      message: "Images classified successfully.",
      body: { sharp, blur }
    });
  } catch (err) {
    res.status(500).json({ message: "Classification failed.", error: err });
  }
};

export const uploadImagesFromBrowser = async (req: Request, res: Response) => {
  try {
    const images = req.files as Express.Multer.File[];
    for (const image of images) {
      const buffer = await convertToJpeg(
        image.buffer,
        image.mimetype,
        image.originalname
      );
      const key = image.originalname.replace(/\.heic$/i, ".jpg");
      await uploadImageFromBuffer({
        bucketName: BUCKET,
        key: key,
        buffer: buffer
      });
    }

    res.json({ message: "Image files uploaded successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Image file upload from browser failed.", error: err });
  }
};

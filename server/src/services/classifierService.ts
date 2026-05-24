/*
  Fetch image from S3 URL, send to FastAPI for classification, and return the result and S3 URL.
*/

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3Client from "../config/s3Client.js";

export const classifyImage = async ({
  bucketName,
  key
}: {
  bucketName: string;
  key: string;
}) => {
  const normalizedKey = key.replace(/\.heic$/i, ".jpg");
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: normalizedKey
  });
  const image = await s3Client.send(command);

  const urlCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: normalizedKey
  });
  const url = await getSignedUrl(s3Client, urlCommand, { expiresIn: 3600 });

  // temporarily hold image in a Buffer
  const byteArray = await image.Body?.transformToByteArray();
  if (!byteArray) throw new Error(`Failed to fetch image from S3: ${key}`);
  const buffer = Buffer.from(byteArray);

  // send buffer to FastAPI
  const form = new FormData();
  form.append("file", new Blob([buffer]), normalizedKey);

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: form
  });

  const result = await response.json();
  return { ...result, filename: normalizedKey, url };
};

/*
  Implements S3 interaction for upload, list, download, and empty. 
*/

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js";

export const listImagesInBucket = async ({
  bucketName
}: {
  bucketName: string;
}) => {
  const { Contents: images } = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName })
  );

  if (!images || images.length === 0) {
    console.log("Bucket is empty");
    return [];
  }

  return images;
};

export const downloadImagesFromBucket = async ({
  bucketName,
  downloadPath
}: {
  bucketName: string;
  downloadPath: string;
}) => {
  const { Contents: images } = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName })
  );

  if (!images || images.length === 0) {
    console.log("Bucket is empty");
    return;
  }

  for (const image of images) {
    if (!image.Key) continue;

    const obj = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: image.Key })
    );

    if (!obj.Body) continue;
    writeFileSync(
      `${downloadPath}/${image.Key}`,
      await obj.Body?.transformToByteArray()
    );
  }

  console.log("Images downloaded successfully.\n");
};

export const emptyBucket = async ({ bucketName }: { bucketName: string }) => {
  const { Contents: images } = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName })
  );

  if (!images || images.length === 0) {
    console.log("Bucket is empty");
    return;
  }

  const objects = images
    .filter((image) => image.Key !== undefined)
    .map((image) => ({
      Key: image.Key as string
    }));

  const deleteCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: { Objects: objects }
  });
  await s3Client.send(deleteCommand);
  console.log(`${bucketName} emptied successfully.`);
};

export const deleteImageFromBucket = async ({
  bucketName,
  key
}: {
  bucketName: string;
  key: string;
}) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  });
  await s3Client.send(deleteCommand);
  console.log(`${key} deleted successfully.`);
};

export const uploadImageFromBuffer = async ({
  bucketName,
  buffer,
  key
}: {
  bucketName: string;
  buffer: Buffer;
  key: string;
}) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer
    })
  );
};

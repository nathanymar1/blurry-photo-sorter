/*
  Handles converting .heic format to .jpg before classification.
*/

import convert from "heic-convert";

export const convertToJpeg = async (
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<Buffer> => {
  const isHeic =
    mimetype === "image/heic" ||
    mimetype === "image/heif" ||
    filename.toLowerCase().endsWith(".heic") ||
    filename.toLowerCase().endsWith(".heif");

  if (isHeic) {
    const jpegBuffer = await convert({
      buffer,
      format: "JPEG",
      quality: 0.9
    });
    return Buffer.from(jpegBuffer);
  }
  return buffer;
};

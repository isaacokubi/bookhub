import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import streamifier from "streamifier";

const cloudinaryUnavailable = () => {
  const error = new Error(
    "Image uploads are temporarily unavailable because Cloudinary is not configured.",
  );
  error.statusCode = 503;
  error.code = "CLOUDINARY_NOT_CONFIGURED";
  return error;
};

export const uploadImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      reject(cloudinaryUnavailable());
      return;
    }

    if (!file?.buffer) {
      const error = new Error("No image file was provided.");
      error.statusCode = 400;
      reject(error);
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "bookhub/books",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

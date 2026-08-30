import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      reject(new Error("No image file was provided."));
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

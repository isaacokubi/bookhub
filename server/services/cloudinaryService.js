import cloudinary from "../config/cloudinary.js";

import streamifier from "streamifier";

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "bookhub/books",
      },

      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

export const isCloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET,
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  // Cloudinary is an optional runtime capability. Do not prevent the API
  // from starting when image-upload credentials have not been configured.
  // Upload endpoints should return a clear service-unavailable response when
  // they are used without Cloudinary credentials.
  console.warn(
    "Cloudinary is not configured. Image upload features are disabled until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set.",
  );
}

export default cloudinary;

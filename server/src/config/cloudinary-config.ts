import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: env.NODE_ENV === "production",
  });
  return cloudinary;
};

export type CloudinaryUploadOptions = {
  folder?: string;
  public_id?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
  overwrite?: boolean;
  transformation?: any[];
};

export const cloudinaryInstance = configureCloudinary();


import {
  cloudinaryInstance,
  CloudinaryUploadOptions,
} from "../config/cloudinary-config.js";
import { FileInfo } from "../types/file-upload-types.js";
import { logger } from "../utils/logger.js";

export class CloudinaryUploadService {
  static async uploadFile(
    file: Buffer,
    options: CloudinaryUploadOptions & { originalFilename: string }
  ): Promise<FileInfo> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinaryInstance.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              logger.error("Cloudinary upload error:", error);
              return reject(error);
            }
            if (!result) {
              return reject(new Error("Cloudinary upload returned no result"));
            }

            const fileInfo: FileInfo = {
              fieldname: "file",
              filename: options.originalFilename,
              encoding: "7bit",
              mimetype:
                result.resource_type === "image"
                  ? `image/${result.format}`
                  : "application/octet-stream",
              size: result.bytes,
              publicUrl: result.secure_url,
              cloudinaryId: result.public_id,
              resourceType: result.resource_type,
            };

            resolve(fileInfo);
          }
        );

        uploadStream.end(file);
      });
    } catch (error) {
      logger.error("Error in Cloudinary upload:", error);
      throw error;
    }
  }

  static async deleteFile(publicId: string, resourceType: string = "image") {
    try {
      await cloudinaryInstance.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      logger.error("Error deleting Cloudinary file:", error);
      throw error;
    }
  }
}

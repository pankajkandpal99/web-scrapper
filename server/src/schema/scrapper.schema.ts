import { z } from "zod";

export const scrapeSchema = z.object({
  url: z
    .string()
    .url("Invalid URL format")
    .min(1, "URL is required")
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
        );
      } catch {
        return false;
      }
    }, "URL must be a valid HTTP or HTTPS URL"),
});

export const bulkScrapeSchema = z.object({
  urls: z
    .array(
      z
        .string()
        .url("Invalid URL format")
        .min(1, "URL is required")
        .refine((url) => {
          try {
            const parsedUrl = new URL(url);
            return (
              parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
            );
          } catch {
            return false;
          }
        }, "URL must be a valid HTTP or HTTPS URL")
    )
    .min(1, "At least one URL is required")
    .max(20, "Maximum 20 URLs allowed per request"),
});

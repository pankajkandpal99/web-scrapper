import { z } from "zod";

export const scrapeSchema = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
});

export type ScrapeInput = z.infer<typeof scrapeSchema>;

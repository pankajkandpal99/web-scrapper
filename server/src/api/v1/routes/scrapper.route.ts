import { Router } from "express";
import { createApiHandler } from "../../../utils/api-factory.js";
import { scrapeSchema } from "@/schema/scrapper.schema.js";
import { ScraperController } from "../controllers/scrapper.controller.js";

export default (router: Router) => {
  router.post(
    "/scraper",
    createApiHandler(ScraperController.scrape, {
      bodySchema: scrapeSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.get(
    "/scraper/history",
    createApiHandler(ScraperController.getHistory, {
      requireAuth: true,
      useTransaction: true,
    })
  );

  router.delete(
    "/scraper/clear",
    createApiHandler(ScraperController.clearHistory, {
      requireAuth: true,
      useTransaction: true,
    })
  );

  router.get(
    "/scraper/:id",
    createApiHandler(ScraperController.getScrapedData, {
      requireAuth: true,
      useTransaction: true,
    })
  );
};

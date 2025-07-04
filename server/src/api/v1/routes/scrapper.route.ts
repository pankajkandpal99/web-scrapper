import { Router } from "express";
import { createApiHandler } from "../../../utils/api-factory.js";
import { ScraperController } from "../controllers/scrapper.controller.js";
import { bulkScrapeSchema, scrapeSchema } from "@/schema/scrapper.schema.js";

export default (router: Router) => {
  router.post(
    "/scraper",
    createApiHandler(ScraperController.scrapeWebsite, {
      bodySchema: scrapeSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.post(
    "/scraper/bulk",
    createApiHandler(ScraperController.scrapeMultipleWebsites, {
      bodySchema: bulkScrapeSchema,
      useTransaction: true,
      requireAuth: true,
    })
  );

  router.get(
    "/scraper/history",
    createApiHandler(ScraperController.getScrapingHistory, {
      requireAuth: true,
      useTransaction: true,
    })
  );

  router.delete(
    "/scraper/clear",
    createApiHandler(ScraperController.clearScrapedData, {
      requireAuth: true,
      useTransaction: true,
    })
  );

  router.get(
    "/scraper/:id",
    createApiHandler(ScraperController.getScrapedDataById, {
      requireAuth: true,
      useTransaction: true,
    })
  );

  router.delete(
    "/scraper/items",
    createApiHandler(ScraperController.deleteScrapedItems, {
      requireAuth: true,
      useTransaction: true,
    })
  );
};

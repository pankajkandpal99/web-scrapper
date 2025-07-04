import { RequestContext } from "../../../middleware/context.js";
import { HttpResponse } from "../../../utils/service-response.js";
import { BadRequestError } from "../../../error-handler/index.js";
import { ScraperService } from "@/services/scrapper.service.js";

export const ScraperController = {
  scrapeWebsite: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { url } = context.body;
        const userId = context.user?.id;

        if (!userId) {
          throw new BadRequestError("User authentication required");
        }

        // Rate limiting check (optional - you can implement this based on your needs)
        // const recentScrapes = await ScrapedData.countDocuments({
        //   userId,
        //   createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
        // });
        //
        // if (recentScrapes >= 10) {
        //   throw new BadRequestError("Rate limit exceeded. Please try again later.");
        // }

        const scrapedData = await ScraperService.scrapeWebsite(url, userId);
        return scrapedData;
      });

      return HttpResponse.send(
        context.res,
        {
          success: true,
          data: result,
          message: "Website scraped successfully",
        },
        201
      );
    } catch (error) {
      console.error("error occured while scraping : ", error);
      throw error;
    }
  },

  scrapeMultipleWebsites: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { urls } = context.body;
        const userId = context.user?.id;

        if (!userId) {
          throw new BadRequestError("User authentication required");
        }

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          throw new BadRequestError("At least one URL is required");
        }

        if (urls.length > 20) {
          throw new BadRequestError("Maximum 20 URLs allowed per request");
        }

        return await ScraperService.scrapeMultipleWebsites(urls, userId);
      });

      return HttpResponse.send(
        context.res,
        {
          success: true,
          data: result,
          message: "Bulk scraping completed",
        },
        201
      );
    } catch (error) {
      throw error;
    }
  },

  getScrapingHistory: async (context: RequestContext) => {
    try {
      const userId = context.user?.id;

      if (!userId) {
        throw new BadRequestError("User authentication required");
      }

      // const page = parseInt(context.query?.page as string) || 1;
      // const limit = parseInt(context.query?.limit as string) || 10;

      // Validate pagination parameters
      // if (page < 1 || limit < 1 || limit > 100) {
      //   throw new BadRequestError("Invalid pagination parameters");
      // }

      const result = await ScraperService.getScrapingHistory(userId);

      return HttpResponse.send(
        context.res,
        {
          success: true,
          data: result,
          // pagination: result.pagination,
          message: "Scraping history retrieved successfully",
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },

  clearScrapedData: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const userId = context.user?.id;

        if (!userId) {
          throw new BadRequestError("User authentication required");
        }

        const clearResult = await ScraperService.clearScrapedData(userId);
        return clearResult;
      });

      return HttpResponse.send(
        context.res,
        {
          success: true,
          data: result,
          message: "Scraped data cleared successfully",
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },

  getScrapedDataById: async (context: RequestContext) => {
    try {
      const userId = context.user?.id;
      const { id } = context.params;

      if (!userId) {
        throw new BadRequestError("User authentication required");
      }

      if (!id) {
        throw new BadRequestError("Scraped data ID is required");
      }

      const result = await ScraperService.getScrapedDataById(id, userId);

      return HttpResponse.send(
        context.res,
        {
          success: true,
          data: result,
          message: "Scraped data retrieved successfully",
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },

  deleteScrapedItems: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const userId = context.user?.id;
        const { ids } = context.body;

        if (!userId) {
          throw new BadRequestError("User authentication required");
        }

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
          throw new BadRequestError("Invalid item IDs provided");
        }

        return await ScraperService.deleteScrapedItems(ids, userId);
      });

      return HttpResponse.send(
        context.res,
        {
          success: true,
          data: result,
          message: "Items deleted successfully",
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },
};

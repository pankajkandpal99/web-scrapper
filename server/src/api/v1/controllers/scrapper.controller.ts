import { RequestContext } from "../../../middleware/context.js";
import { HttpResponse } from "../../../utils/service-response.js";
import { ScrapedData } from "../../../models/scraped-data.model.js";
import { NotFoundError } from "../../../error-handler/index.js";
import { scrapeWebsite } from "@/services/scrapper.service.js";

export const ScraperController = {
  scrape: async (context: RequestContext) => {
    try {
      const { url } = context.body;
      const userId = context.user?.id;

      // Validate URL
      if (!url || typeof url !== "string") {
        throw new Error("Invalid URL provided");
      }

      // Scrape the website
      const scrapedData = await scrapeWebsite(url);

      // Save to database
      const result = await ScrapedData.create({
        url,
        data: scrapedData,
        userId,
        createdAt: new Date(),
      });

      return HttpResponse.send(
        context.res,
        {
          id: (result._id as string | { toString(): string }).toString(),
          url: result.url,
          data: result.data,
          createdAt: result.createdAt,
        },
        201
      );
    } catch (error) {
      throw error;
    }
  },

  getHistory: async (context: RequestContext) => {
    try {
      const userId = context.user?.id;
      const query = context.query ?? {};
      const page = parseInt((query.page as string) ?? "1") || 1;
      const limit = parseInt((query.limit as string) ?? "10") || 10;

      console.log("Get History userId : ", userId);
      console.log("Get History query : ", query);

      const results = await ScrapedData.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await ScrapedData.countDocuments({ userId });

      return HttpResponse.send(
        context.res,
        {
          data: results.map((item) => ({
            id: item._id.toString(),
            url: item.url,
            createdAt: item.createdAt,
          })),
          meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },

  clearHistory: async (context: RequestContext) => {
    try {
      const userId = context.user?.id;

      await ScrapedData.deleteMany({ userId });

      return HttpResponse.send(
        context.res,
        {
          message: "Scraping history cleared successfully",
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },

  getScrapedData: async (context: RequestContext) => {
    try {
      const { id } = context.params;
      const userId = context.user?.id;

      const result = await ScrapedData.findOne({
        _id: id,
        userId,
      }).lean();

      if (!result) {
        throw new NotFoundError("Scraped data not found");
      }

      return HttpResponse.send(
        context.res,
        {
          id: result._id.toString(),
          url: result.url,
          data: result.data,
          createdAt: result.createdAt,
        },
        200
      );
    } catch (error) {
      throw error;
    }
  },
};

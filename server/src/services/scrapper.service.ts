import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { ScrapedData } from "@/models/scraped-data.model.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/error-handler/index.js";

export class ScraperService {
  private static async launchBrowser() {
    try {
      return await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
        ],
      });
    } catch (error) {
      throw new InternalServerError("Failed to launch browser");
    }
  }

  private static extractCompanyInfo(html: string, url: string) {
    const $ = cheerio.load(html);
    const companyInfo: any = {};

    // Extract company name
    companyInfo.name =
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      $('[data-testid="company-name"]').text().trim() ||
      $(".company-name").text().trim();

    // Extract description
    companyInfo.description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $(".company-description").text().trim() ||
      $(".about-company").text().trim();

    // Extract website
    companyInfo.website = url;

    // Extract location
    companyInfo.location =
      $('[data-testid="location"]').text().trim() ||
      $(".location").text().trim() ||
      $(".company-location").text().trim();

    // Extract industry
    companyInfo.industry =
      $('[data-testid="industry"]').text().trim() ||
      $(".industry").text().trim() ||
      $(".company-industry").text().trim();

    // Extract employee count
    companyInfo.employees =
      $('[data-testid="employees"]').text().trim() ||
      $(".employees").text().trim() ||
      $(".company-size").text().trim();

    // Extract founded year
    companyInfo.founded =
      $('[data-testid="founded"]').text().trim() ||
      $(".founded").text().trim() ||
      $(".company-founded").text().trim();

    // Extract contact information
    const emailMatch = html.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
    );
    const phoneMatch = html.match(/(\+?[\d\s\-\(\)]{10,})/);

    companyInfo.contact = {
      email: emailMatch ? emailMatch[1] : undefined,
      phone: phoneMatch ? phoneMatch[1] : undefined,
      address:
        $(".address").text().trim() || $(".company-address").text().trim(),
    };

    // Extract social media links
    companyInfo.socialMedia = {
      linkedin: $('a[href*="linkedin.com"]').attr("href"),
      twitter:
        $('a[href*="twitter.com"]').attr("href") ||
        $('a[href*="x.com"]').attr("href"),
      facebook: $('a[href*="facebook.com"]').attr("href"),
      instagram: $('a[href*="instagram.com"]').attr("href"),
    };

    // Clean up empty fields
    Object.keys(companyInfo).forEach((key) => {
      if (typeof companyInfo[key] === "object" && companyInfo[key] !== null) {
        Object.keys(companyInfo[key]).forEach((subKey) => {
          if (!companyInfo[key][subKey]) {
            delete companyInfo[key][subKey];
          }
        });
        if (Object.keys(companyInfo[key]).length === 0) {
          delete companyInfo[key];
        }
      } else if (!companyInfo[key]) {
        delete companyInfo[key];
      }
    });

    return companyInfo;
  }

  static async scrapeWebsite(url: string, userId: string) {
    const startTime = Date.now();
    let browser;

    try {
      // Validate URL
      new URL(url);

      browser = await this.launchBrowser();
      const page = await browser.newPage();

      // Set user agent and viewport
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to the URL with timeout
      const response = await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      if (!response) {
        throw new BadRequestError("Failed to load the webpage");
      }

      await new Promise((res) => setTimeout(res, 2000)); // Wait for content to load

      const html = await page.content();
      const title = await page.title();

      // Extract text content
      const textContent = await page.evaluate(() => {
        return document.body.innerText;
      });

      const responseTime = Date.now() - startTime;
      const statusCode = response.status();
      const contentLength = html.length;

      // Extract company information
      const companyInfo = this.extractCompanyInfo(html, url);

      // Extract meta description
      const description = await page.evaluate(() => {
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        return metaDescription ? metaDescription.getAttribute("content") : "";
      });

      // Save to database
      const scrapedData = new ScrapedData({
        url,
        title,
        description: description || undefined,
        content: textContent,
        metadata: {
          scrapedAt: new Date(),
          responseTime,
          statusCode,
          contentLength,
        },
        companyInfo:
          Object.keys(companyInfo).length > 0 ? companyInfo : undefined,
        userId,
      });

      await scrapedData.save();

      return {
        id: scrapedData._id,
        url: scrapedData.url,
        title: scrapedData.title,
        description: scrapedData.description,
        content: scrapedData.content,
        metadata: scrapedData.metadata,
        companyInfo: scrapedData.companyInfo,
        createdAt: scrapedData.createdAt,
      };
    } catch (error: any) {
      if (error.name === "TimeoutError") {
        throw new BadRequestError("Website took too long to respond");
      }
      if (error.message.includes("net::ERR_NAME_NOT_RESOLVED")) {
        throw new BadRequestError("Website not found or unreachable");
      }
      if (error.message.includes("Invalid URL")) {
        throw new BadRequestError("Invalid URL format");
      }

      throw new InternalServerError(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  static async scrapeMultipleWebsites(urls: string[], userId: string) {
    try {
      const results = await Promise.allSettled(
        urls.map((url) => this.scrapeWebsite(url, userId))
      );

      return results.map((result) => {
        if (result.status === "fulfilled") {
          return { success: true, data: result.value };
        } else {
          return {
            success: false,
            error: result.reason.message,
            url: result.reason.url, // Add URL to error response
          };
        }
      });
    } catch (error: any) {
      throw new InternalServerError(`Bulk scraping failed: ${error.message}`);
    }
  }

  // static async getScrapingHistory(
  //   userId: string,
  //   page: number = 1,
  //   limit: number = 10
  // ) {
  //   try {
  //     const skip = (page - 1) * limit;

  //     const [data, total] = await Promise.all([
  //       ScrapedData.find({ userId })
  //         .sort({ createdAt: -1 })
  //         .skip(skip)
  //         .limit(limit)
  //         .select("-content") // Exclude content for list view
  //         .lean(),
  //       ScrapedData.countDocuments({ userId }),
  //     ]);

  //     return {
  //       data,
  //       pagination: {
  //         page,
  //         limit,
  //         total,
  //         pages: Math.ceil(total / limit),
  //       },
  //     };
  //   } catch (error) {
  //     throw new InternalServerError("Failed to fetch scraping history");
  //   }
  // }

  static async getScrapingHistory(userId: string) {
    try {
      const data = await ScrapedData.find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .select("-content")
        .lean();

      return data;
    } catch (error) {
      throw new InternalServerError("Failed to fetch scraping history");
    }
  }

  static async clearScrapedData(userId: string) {
    try {
      const result = await ScrapedData.deleteMany({ userId });
      return {
        deletedCount: result.deletedCount,
        message: `Cleared ${result.deletedCount} scraped records`,
      };
    } catch (error) {
      throw new InternalServerError("Failed to clear scraped data");
    }
  }

  static async getScrapedDataById(id: string, userId: string) {
    try {
      const data = await ScrapedData.findOne({ _id: id, userId });

      if (!data) {
        throw new NotFoundError("Scraped data not found");
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Failed to fetch scraped data");
    }
  }

  static async deleteScrapedItems(ids: string[], userId: string) {
    try {
      const result = await ScrapedData.deleteMany({
        _id: { $in: ids },
        userId,
      });
      return {
        deletedCount: result.deletedCount,
        message: `Deleted ${result.deletedCount} items`,
      };
    } catch (error) {
      throw new InternalServerError("Failed to delete items");
    }
  }
}

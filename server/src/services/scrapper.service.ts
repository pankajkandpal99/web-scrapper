import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { URL } from "url";

export const scrapeWebsite = async (url: string) => {
  try {
    new URL(url); // Will throw if invalid

    // First try with axios for static content
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      return extractData($);
    } catch (staticError) {
      // Fall back to Puppeteer for dynamic content
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      try {
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        );
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        const content = await page.content();
        const $ = cheerio.load(content);

        await browser.close();
        return extractData($);
      } catch (dynamicError: any) {
        await browser.close();
        throw new Error(`Failed to scrape website: ${dynamicError.message}`);
      }
    }
  } catch (error: any) {
    throw new Error(`Invalid URL or scraping failed: ${error.message}`);
  }
};

function extractData($: cheerio.CheerioAPI) {
  // Extract common data points from webpage
  const title = $("title").text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const headings = {
    h1: $("h1")
      .map((i, el) => $(el).text().trim())
      .get(),
    h2: $("h2")
      .map((i, el) => $(el).text().trim())
      .get(),
    h3: $("h3")
      .map((i, el) => $(el).text().trim())
      .get(),
  };

  const links = $("a")
    .map((i, el) => ({
      text: $(el).text().trim(),
      href: $(el).attr("href"),
    }))
    .get()
    .filter((link) => link.href);

  const images = $("img")
    .map((i, el) => ({
      alt: $(el).attr("alt") || "",
      src: $(el).attr("src"),
    }))
    .get()
    .filter((img) => img.src);

  return {
    metadata: { title, description: metaDescription },
    headings,
    links: links.slice(0, 50), // Limit to first 50 links
    images: images.slice(0, 20), // Limit to first 20 images
    timestamp: new Date().toISOString(),
  };
}

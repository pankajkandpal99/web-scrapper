/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "../api/apiConfig";
import axiosInstance from "../utils/axiosConfig";

export const ScraperService = {
  async scrapeWebsite(url: string) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SCRAPER.SCRAPE, {
        url,
      });

      console.log("Response from scraper: ", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Scraping failed");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async getScrapingHistory() {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SCRAPER.HISTORY);

      console.log("Response from history: ", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch history");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async clearScrapedData() {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.SCRAPER.CLEAR);
      console.log("Cleared scraped data: ", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to clear data");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },
};

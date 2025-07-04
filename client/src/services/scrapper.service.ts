/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "../api/apiConfig";
import axiosInstance from "../utils/axiosConfig";

interface ScrapeOptions {
  extractCompanyInfo?: boolean;
  includeMetadata?: boolean;
  depth?: number;
}

export const ScraperService = {
  async scrapeWebsite(url: string, options?: ScrapeOptions) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SCRAPER.SCRAPE, {
        url,
        options,
      });
      return response.data.data.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Scraping failed");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async scrapeMultipleWebsites(urls: string[], options?: ScrapeOptions) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SCRAPER.BULK_SCRAPE,
        {
          urls,
          options,
        }
      );
      return response.data.data.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Bulk scraping failed");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async getScrapingHistory() {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SCRAPER.HISTORY);
      return response.data?.data?.data || [];
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
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to clear data");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async deleteScrapedItems(ids: string[]) {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.SCRAPER.DELETE_ITEMS,
        { data: { ids } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to delete items");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },
};

// -------------------------------------------------------------------------

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { API_ENDPOINTS } from "../api/apiConfig";
// import axiosInstance from "../utils/axiosConfig";

// export const ScraperService = {
//   async scrapeWebsite(url: string) {
//     try {
//       const response = await axiosInstance.post(API_ENDPOINTS.SCRAPER.SCRAPE, {
//         url,
//       });

//       return response.data.data.data;
//     } catch (error: any) {
//       if (error.response) {
//         const serverError = error.response.data;
//         throw new Error(serverError.error || "Scraping failed");
//       }
//       throw new Error("Network error occurred. Please try again.");
//     }
//   },

//   async getScrapingHistory() {
//     try {
//       const response = await axiosInstance.get(API_ENDPOINTS.SCRAPER.HISTORY);

//       return response.data?.data?.data || [];
//     } catch (error: any) {
//       if (error.response) {
//         const serverError = error.response.data;
//         throw new Error(serverError.error || "Failed to fetch history");
//       }
//       throw new Error("Network error occurred. Please try again.");
//     }
//   },

//   async clearScrapedData() {
//     try {
//       const response = await axiosInstance.delete(API_ENDPOINTS.SCRAPER.CLEAR);
//       console.log("Cleared scraped data: ", response.data);
//       return response.data;
//     } catch (error: any) {
//       if (error.response) {
//         const serverError = error.response.data;
//         throw new Error(serverError.error || "Failed to clear data");
//       }
//       throw new Error("Network error occurred. Please try again.");
//     }
//   },

//   async deleteScrapedItems(ids: string[]) {
//     try {
//       const response = await axiosInstance.delete(
//         API_ENDPOINTS.SCRAPER.DELETE_ITEMS,
//         {
//           data: { ids },
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       if (error.response) {
//         const serverError = error.response.data;
//         throw new Error(serverError.error || "Failed to delete items");
//       }
//       throw new Error("Network error occurred. Please try again.");
//     }
//   },
// };

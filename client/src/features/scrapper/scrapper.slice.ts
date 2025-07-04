/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ScraperService } from "../../services/scrapper.service";

interface ScraperState {
  data: any;
  loading: boolean;
  error: string | null;
  history: any[];
  currentUrl: string | null;
}

const initialState: ScraperState = {
  data: null,
  loading: false,
  error: null,
  history: [],
  currentUrl: null,
};

export const scrapeWebsite = createAsyncThunk(
  "scraper/scrape",
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await ScraperService.scrapeWebsite(url);
      return {
        data: response,
        url,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Scraping failed");
    }
  }
);

export const getScrapingHistory = createAsyncThunk(
  "scraper/history",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ScraperService.getScrapingHistory();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch history");
    }
  }
);

export const clearScrapedData = createAsyncThunk(
  "scraper/clear",
  async (_, { rejectWithValue }) => {
    try {
      await ScraperService.clearScrapedData();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to clear data");
    }
  }
);

const scraperSlice = createSlice({
  name: "scraper",
  initialState,
  reducers: {
    resetScraperError: (state) => {
      state.error = null;
    },
    setCurrentUrl: (state, action) => {
      state.currentUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Scrape Website
      .addCase(scrapeWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scrapeWebsite.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.currentUrl = action.payload.url;
        state.history = [
          { url: action.payload.url, data: action.payload.data },
          ...state.history,
        ].slice(0, 10); // Keep last 10 items
      })
      .addCase(scrapeWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get History
      .addCase(getScrapingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScrapingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(getScrapingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Clear Data
      .addCase(clearScrapedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearScrapedData.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
        state.currentUrl = null;
      })
      .addCase(clearScrapedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetScraperError, setCurrentUrl } = scraperSlice.actions;
export default scraperSlice.reducer;

import { API_BASE_URL } from "../config/config";

const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  },
  USER: {
    CURRENT_USER: `${API_BASE_URL}/api/v1/users/me`,
    PROFILE: `${API_BASE_URL}/api/v1/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/v1/users/update`,
  },
  ADMIN: {
    HERO_SECTION: `${API_BASE_URL}/api/v1/admin/home/hero-section`,
    UPLOAD_IMAGE: `${API_BASE_URL}/api/v1/upload-image`,
  },
  SCRAPER: {
    SCRAPE: `${API_BASE_URL}/api/v1/scraper`,
    BULK_SCRAPE: `${API_BASE_URL}/api/v1/scraper/bulk`,
    HISTORY: `${API_BASE_URL}/api/v1/scraper/history`,
    CLEAR: `${API_BASE_URL}/api/v1/scraper/clear`,
    GET_SCRAPED_DATA: `${API_BASE_URL}/api/v1/scraper/:id`,
    DELETE_ITEMS: `${API_BASE_URL}/api/v1/scraper/items`,
  },
};

export { API_ENDPOINTS };

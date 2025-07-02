import { API_ENDPOINTS } from "../api/apiConfig";
import axiosInstance from "../utils/axiosConfig";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const UserService = {
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT_USER);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch user details");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },
};

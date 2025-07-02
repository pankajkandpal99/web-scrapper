import axios from "axios";

const TOKEN_KEY = "auth_token";

interface AuthResponse {
  token: string;
  user?: unknown; // Optional user data from API (not stored)
}

export const checkAuthToken = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  try {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (error) {
    console.error("Failed to set auth token:", error);
    throw error;
  }
};

export const clearAuthData = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

export const handleAuthentication = (response: AuthResponse): void => {
  if (!response?.token) {
    throw new Error("Token not found in response");
  }

  setAuthToken(response.token);
};

export const verifyTokenClientSide = (): boolean => {
  return checkAuthToken();
};

export const logout = clearAuthData;

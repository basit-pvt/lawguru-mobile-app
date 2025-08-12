import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.109:8000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-platform": "mobile",
  },
  withCredentials: false,
});

// Track if we're currently refreshing token to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Check if token is expired or about to expire (within 1 minute)
function isTokenExpired(expiresAt: string): boolean {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const oneMinute = 60 * 1000;
  return expiry - now < oneMinute;
}

// Refresh token function
async function refreshToken(): Promise<string> {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(`/auth/refresh`, {
      refreshToken,
    });

    const tokens = response.data.tokens;

    console.log("Received new tokens - storing...", response.data);
    // Update tokens in storage with clean versions
    await AsyncStorage.multiSet([
      ["accessToken", tokens.accessToken],
      ["accessTokenExpires", tokens.accessTokenExpires],
      ["refreshToken", tokens.refreshToken],
      ["refreshTokenExpires", tokens.refreshTokenExpires],
    ]);

    return tokens.accessToken;
  } catch (error) {
    // Clear all auth data if refresh fails
    await AsyncStorage.multiRemove([
      "user",
      "accessToken",
      "refreshToken",
      "accessTokenExpires",
      "refreshTokenExpires",
    ]);
    throw error;
  }
}

// Request interceptor for automatic token attachment
apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth for login, register, and refresh endpoints
    const publicEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      return config;
    }

    let accessToken = await AsyncStorage.getItem("accessToken");
    const accessTokenExpires = await AsyncStorage.getItem("accessTokenExpires");

    console.log(
      "Request interceptor - Current token:",
      accessToken ? "exists" : "missing"
    );
    console.log("Token expires:", accessTokenExpires);

    // Check if token is expired or missing
    const shouldRefresh =
      !accessToken ||
      (accessTokenExpires && isTokenExpired(accessTokenExpires));

    if (shouldRefresh) {
      console.log("Token needs refresh - missing or expired");

      if (isRefreshing) {
        console.log("Already refreshing, queueing request");
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            },
            reject: (error: any) => {
              reject(error);
            },
          });
        });
      }

      isRefreshing = true;
      console.log("Starting token refresh...");

      try {
        const newAccessToken = await refreshToken();
        console.log("Token refresh successful");
        processQueue(null, newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (refreshError) {
        console.log("Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    } else {
      // Token is still valid
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Response interceptor - Status:", error.response?.status);
    console.log("Original request URL:", originalRequest.url);

    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Got 401, attempting token refresh");
      originalRequest._retry = true;

      // Skip refresh for public endpoints
      const publicEndpoints = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
      ];
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      );

      if (isPublicEndpoint) {
        console.log("401 on public endpoint, not refreshing");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        console.log("Already refreshing, queueing retry request");
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              console.log("Retrying queued request with new token");
              resolve(apiClient(originalRequest));
            },
            reject: (error: any) => {
              reject(error);
            },
          });
        });
      }

      isRefreshing = true;
      console.log("Starting token refresh from 401 response");

      try {
        const newAccessToken = await refreshToken();
        console.log("Token refresh successful from 401 handler");
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("Retrying original request with new token");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed in 401 handler:", refreshError);
        processQueue(refreshError, null);

        // Clear auth data - this should trigger logout in your app
        await AsyncStorage.multiRemove([
          "user",
          "accessToken",
          "refreshToken",
          "accessTokenExpires",
          "refreshTokenExpires",
        ]);

        console.log("Cleared auth data due to refresh failure");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

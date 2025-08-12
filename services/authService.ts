import { Category } from "@/app/types/user";
import apiClient from "@/app/lib/api-client";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  userType: "USER" | "LAWYER";
  lawyerId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
  refreshTokenExpires: string;
}

export interface AuthResponse {
  user: any;
  tokens: AuthTokens;
  message?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpires: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiClient.post(`/auth/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Invalid email or password. Please try again.";
    throw new Error(message);
  }
}

export async function registerApi(payload: RegisterPayload): Promise<void> {
  try {
    const response = await apiClient.post(`/auth/register`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Registration failed. Please try again.";
    throw new Error(message);
  }
}

export async function logoutApi(): Promise<void> {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) {
      await apiClient.post(`/auth/logout`, { refreshToken });
    }
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with local logout even if API fails
  }
}

export async function updateUserApi({
  userId,
  name,
  preferredCategories,
}: {
  userId: string;
  name: string;
  preferredCategories?: string[];
}): Promise<any> {
  try {
    console.log({ preferredCategories });
    const response = await apiClient.put(
      `/users/${userId}`,
      { name, preferredCategories },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update user.";
    throw new Error(message);
  }
}

// Token refresh function - only handles API call
export async function refreshAccessTokenApi(): Promise<RefreshTokenResponse> {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(`/auth/refresh`, {
      refreshToken,
    });

    return response.data.tokens; // Just return the new token data
  } catch (error: any) {
    console.error("Token refresh API failed:", error);
    throw error;
  }
}

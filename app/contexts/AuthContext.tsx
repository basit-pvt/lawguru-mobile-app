import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import {
  AuthTokens,
  logoutApi,
  refreshAccessTokenApi,
} from "@/services/authService";
import {
  saveUserPreferences,
  UserPreferences,
} from "@/services/SharedData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  updateUserInContext: (userData: Partial<User>) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user?.id;

  const login = async (userData: User, tokens: AuthTokens) => {
    try {
      console.log("Saving user data and tokens...");
      // Save user data
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      // Save all tokens
      await AsyncStorage.multiSet([
        ["accessToken", tokens.accessToken],
        ["refreshToken", tokens.refreshToken],
        ["accessTokenExpires", tokens.accessTokenExpires],
        ["refreshTokenExpires", tokens.refreshTokenExpires],
      ]);
      setUser(userData);
      await saveUserPreferences({
        isLoggedIn: true,
        preferredCategories: userData.preferredCategories?.map((c) => c.id) || [],
      });
      console.log("Login data saved successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  };

  // Update user data in both state and storage
  const updateUserInContext = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      await saveUserPreferences({
        isLoggedIn: true,
        preferredCategories:
          updatedUser.preferredCategories?.map((c) => c.id) || [],
      });
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      throw new Error("Failed to update user data");
    }
  };

  // Get access token from storage
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      return token ? token.trim() : null;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  };

  // Refresh access token and update storage
  const getRefreshToken = async (): Promise<boolean> => {
    try {
      console.log("Refreshing access token...");
      const response = await refreshAccessTokenApi();

      // Update tokens in storage
      await AsyncStorage.multiSet([
        ["accessToken", response.accessToken],
        ["accessTokenExpires", response.accessTokenExpires],
      ]);

      console.log("Access token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout user
      await logout();
      return false;
    }
  };

  // Centralized logout with cleanup
  const logout = async () => {
    try {
      console.log("Logging out user...");

      // Call logout API to invalidate refresh token on server
      try {
        await logoutApi();
        console.log("Server logout successful");
      } catch (apiError) {
        console.error("Server logout failed:", apiError);
        // Continue with local logout even if API fails
      }

      // Clear all auth-related data from storage
      await AsyncStorage.multiRemove([
        "user",
        "accessToken",
        "refreshToken",
        "accessTokenExpires",
        "refreshTokenExpires",
      ]);

      await saveUserPreferences({
        isLoggedIn: false,
        preferredCategories: [],
      });

      setUser(null);
      console.log("Local logout completed");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force state reset even if storage operations fail
      setUser(null);
    }
  };

  // Check auth status on app start/resume
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      console.log("Checking auth status...");

      // Get all auth data from storage
      const [
        userData,
        accessToken,
        refreshToken,
        accessTokenExpires,
        refreshTokenExpires,
      ] = await AsyncStorage.multiGet([
        "user",
        "accessToken",
        "refreshToken",
        "accessTokenExpires",
        "refreshTokenExpires",
      ]);

      const user = userData[1] ? JSON.parse(userData[1]) : null;
      const hasAccessToken = !!accessToken[1];
      const hasRefreshToken = !!refreshToken[1];

      // Debug: log the retrieved refresh token
      if (refreshToken[1]) {
        console.log(
          "Retrieved refresh token:",
          JSON.stringify(refreshToken[1])
        );
        console.log("Retrieved refresh token length:", refreshToken[1].length);
      }

      // Check if refresh token is expired
      const isRefreshTokenExpired = refreshTokenExpires[1]
        ? new Date() > new Date(refreshTokenExpires[1])
        : true;

      // Check if access token is expired
      const isAccessTokenExpired = accessTokenExpires[1]
        ? new Date() > new Date(accessTokenExpires[1])
        : true;

      if (user && hasRefreshToken && !isRefreshTokenExpired) {
        setUser(user);
        await saveUserPreferences({
          isLoggedIn: true,
          preferredCategories: user.preferredCategories?.map((c) => c.id) || [],
        });
        console.log("User authenticated");

        // If access token is expired but refresh token is valid, refresh it
        if (isAccessTokenExpired && hasAccessToken) {
          console.log("Access token expired, refreshing...");
          await getRefreshToken();
        }
      } else {
        console.log("No valid auth data found, clearing storage");
        // Clear everything if refresh token is expired or missing
        await AsyncStorage.multiRemove([
          "user",
          "accessToken",
          "refreshToken",
          "accessTokenExpires",
          "refreshTokenExpires",
        ]);
        await saveUserPreferences({
          isLoggedIn: false,
          preferredCategories: [],
        });
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
    updateUserInContext,
    getAccessToken,
    getRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_PREFERENCES_KEY = "user-preferences";

export interface UserPreferences {
  isLoggedIn: boolean;
  preferredCategories: string[];
}

export const saveUserPreferences = async (preferences: UserPreferences) => {
  try {
    const jsonValue = JSON.stringify(preferences);

    if (Platform.OS === "ios") {
      // iOS: Use SharedGroupPreferences for widget sharing
      const SharedGroupPreferences =
        require("react-native-shared-group-preferences").default;
      const APP_GROUP_IDENTIFIER = "group.com.weebysagar.myapp";
      await SharedGroupPreferences.setItem(
        USER_PREFERENCES_KEY,
        jsonValue,
        APP_GROUP_IDENTIFIER
      );
    }

    // Always save to AsyncStorage for app usage
    await AsyncStorage.setItem(USER_PREFERENCES_KEY, jsonValue);
    console.log("User preferences saved successfully");
  } catch (e) {
    console.error("Failed to save user preferences", e);
  }
};

export const loadUserPreferences =
  async (): Promise<UserPreferences | null> => {
    try {
      // Try to load from AsyncStorage first
      const jsonValue = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      if (jsonValue) {
        return JSON.parse(jsonValue);
      }

      // Fallback to SharedGroupPreferences on iOS
      if (Platform.OS === "ios") {
        const SharedGroupPreferences =
          require("react-native-shared-group-preferences").default;
        const APP_GROUP_IDENTIFIER = "group.com.weebysagar.myapp";
        const sharedValue = await SharedGroupPreferences.getItem(
          USER_PREFERENCES_KEY,
          APP_GROUP_IDENTIFIER
        );
        return sharedValue != null ? JSON.parse(sharedValue) : null;
      }

      return null;
    } catch (e) {
      console.error("Failed to load user preferences", e);
      return null;
    }
  };

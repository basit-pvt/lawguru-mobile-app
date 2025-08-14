
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

const USER_PREFERENCES_KEY = 'user-preferences';
const APP_GROUP_IDENTIFIER = 'group.com.weebysagar.myapp';

export interface UserPreferences {
  isLoggedIn: boolean;
  preferredCategories: string[];
}

export const saveUserPreferences = async (preferences: UserPreferences) => {
  try {
    const jsonValue = JSON.stringify(preferences);
    if (Platform.OS === 'ios') {
      await SharedGroupPreferences.setItem(USER_PREFERENCES_KEY, jsonValue, { appGroupIdentifier: APP_GROUP_IDENTIFIER });
    } else {
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, jsonValue);
    }
  } catch (e) {
    console.error('Failed to save user preferences', e);
  }
};

export const loadUserPreferences = async (): Promise<UserPreferences | null> => {
  try {
    let jsonValue: string | null = null;
    if (Platform.OS === 'ios') {
      jsonValue = await SharedGroupPreferences.getItem(USER_PREFERENCES_KEY, { appGroupIdentifier: APP_GROUP_IDENTIFIER });
    } else {
      jsonValue = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load user preferences', e);
    return null;
  }
};

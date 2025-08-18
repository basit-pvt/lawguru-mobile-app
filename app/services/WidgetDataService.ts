import * as FileSystem from "expo-file-system";
import SharedGroupPreferences from "react-native-shared-group-preferences";
import { Platform } from "react-native";

const WIDGET_DATA_KEY = "news_widget_data";
const APP_GROUP_IDENTIFIER = "group.com.weebysagar.myapp";

// Import the native module for Android
let SharedDataModule: any = null;
if (Platform.OS === "android") {
  try {
    SharedDataModule = require("react-native").NativeModules.SharedData;
  } catch (error) {
    console.warn("SharedData module not available on Android");
  }
}

export const updateWidgetData = async (articles: any[]) => {
  const latestArticle = articles[0];
  if (!latestArticle) return;

  const imageUrl = latestArticle.imageUrl;
  const fileName = imageUrl.split("/").pop();
  const localImageUri = `${FileSystem.documentDirectory}${fileName}`;

  try {
    await FileSystem.downloadAsync(imageUrl, localImageUri);
    const widgetData = {
      ...latestArticle,
      localImageUrl: localImageUri,
    };

    if (Platform.OS === "ios") {
      // iOS: Use SharedGroupPreferences for widget sharing
      await SharedGroupPreferences.setItem(
        WIDGET_DATA_KEY,
        JSON.stringify(widgetData),
        APP_GROUP_IDENTIFIER
      );
    } else if (Platform.OS === "android" && SharedDataModule) {
      // Android: Use our native module
      await SharedDataModule.set(JSON.stringify(widgetData));
    }
  } catch (error) {
    console.error("Error updating widget data:", error);
  }
};

// New function to refresh widget data when preferences change
export const refreshWidgetData = async () => {
  try {
    // This function can be called when user preferences change
    // It will trigger a refresh of the widget data
    console.log("Widget data refresh triggered");

    // You can add logic here to fetch new articles based on updated preferences
    // For now, this just logs that a refresh was requested
  } catch (error) {
    console.error("Error refreshing widget data:", error);
  }
};

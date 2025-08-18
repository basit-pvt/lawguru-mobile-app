# Home Screen Widget Setup Guide

This guide explains how to set up and use the home screen widget for the LawGuru news app on both Android and iOS.

## Overview

The home screen widget displays the latest news article and updates automatically. If the user is logged in and has preferred categories, it shows news from those categories. Otherwise, it shows the most recent news article.

## Android Setup

### 1. Widget Components

The Android widget consists of several components:

- **NewsWidgetProvider.kt**: Main widget provider class that handles widget updates
- **SharedDataModule.kt**: Native module for sharing data between the app and widget
- **SharedDataPackage.kt**: Package registration for the native module
- **news_widget.xml**: Widget layout file
- **widgetprovider_newswidget.xml**: Widget configuration

### 2. How It Works

1. The app downloads news articles and saves them locally
2. When a new article is available, it's saved to SharedPreferences via the SharedDataModule
3. The widget reads this data from SharedPreferences and displays it
4. The widget updates every 24 hours (configurable in widgetprovider_newswidget.xml)

### 3. Adding the Widget

1. Long press on your home screen
2. Select "Widgets"
3. Find "LawGuru News" in the widget list
4. Drag and drop it to your home screen
5. The widget will automatically display the latest news

## iOS Setup

### 1. Widget Components

The iOS widget consists of:

- **Widget.swift**: Main widget implementation using WidgetKit and SwiftUI
- **App Group**: Shared data storage between the main app and widget

### 2. Xcode Configuration Required

To properly set up the iOS widget, you need to:

1. Open the project in Xcode
2. Add a new Widget Extension target
3. Configure App Groups for shared data
4. Set up the widget bundle identifier

### 3. Current Status

The iOS widget code is written but needs proper Xcode project configuration to work.

## Usage

### For Users

1. **Add Widget**: Long press home screen → Widgets → LawGuru News
2. **Widget Features**:
   - Displays latest news article with image
   - Shows article title
   - Tapping opens the article in the app
   - Updates automatically every 24 hours

### For Developers

#### Updating Widget Data

```typescript
import { updateWidgetData } from './services/WidgetDataService';

// Call this when new articles are loaded
await updateWidgetData(articles);
```

#### Widget Data Structure

```typescript
interface WidgetArticle {
  id: string;
  title: string;
  localImageUrl: string;
}
```

## Troubleshooting

### Android Issues

1. **Widget not showing**: Check if the app has been installed and run at least once
2. **Widget not updating**: Verify that the SharedDataModule is properly registered
3. **Build errors**: Ensure all Kotlin files are properly formatted and imports are correct

### iOS Issues

1. **Widget not appearing**: The widget extension needs to be properly configured in Xcode
2. **Data not sharing**: Verify App Groups are configured correctly
3. **Build failures**: Check that the widget target is properly linked

## Technical Details

### Data Flow

1. **App Side**: News articles are fetched and processed
2. **Storage**: Article data is saved to platform-specific storage:
   - Android: SharedPreferences via SharedDataModule
   - iOS: UserDefaults with App Group
3. **Widget**: Widget reads data and displays it
4. **Updates**: Widget refreshes automatically based on configuration

### Permissions

- **Android**: No special permissions required
- **iOS**: App Groups permission needed for data sharing

### Performance

- Widget updates are limited to prevent excessive battery usage
- Images are cached locally for faster loading
- Widget updates happen in the background

## Future Enhancements

1. **Multiple Widget Sizes**: Support for different widget dimensions
2. **Customization**: Allow users to choose which article to display
3. **Real-time Updates**: Push notifications for breaking news
4. **Multiple Widgets**: Support for multiple instances with different content

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify that all native modules are properly registered
3. Ensure the widget is added to the home screen
4. Check that the app has been run at least once to initialize data

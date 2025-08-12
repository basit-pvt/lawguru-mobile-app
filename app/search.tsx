import React from "react";
import { View, Text } from "react-native";

export default function GlobalSearch() {
  return (
    <View className="flex-1 bg-background-DEFAULT p-4">
      <Text className="text-h1 text-color-heading mb-2">Global Search</Text>
      <Text className="text-body text-color-muted mb-4">
        Search input, recent searches, results tabs (All, News, Cases, Acts,
        Questions), filters...
      </Text>
    </View>
  );
}

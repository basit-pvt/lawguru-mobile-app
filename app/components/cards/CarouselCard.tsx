import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Article } from "@/app/types/articles";

const { width: screenWidth } = Dimensions.get("window");

export default function CarouselCard({
  imageUrl,
  title,
  content,
  author,
  categories,
  id,
  slug,
  updatedAt,
  publishedAt,
}: Article) {
  const formattedPublishedTime = new Date(publishedAt);
  return (
    <View
      style={{
        width: screenWidth * 0.85,
        // marginLeft: 16,
        // marginRight: 8,
      }}
      className="bg-background-card rounded-xl overflow-hidden shadow-md"
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-[160px]"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-h3 text-color-heading mb-xs">{title}</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-caption text-color-muted">
            {formattedPublishedTime.toDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

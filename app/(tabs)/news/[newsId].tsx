import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { Clock, User } from "lucide-react-native";
import axios from "axios";
import { useArticlesById } from "@/services/articlesService";

export default function NewsDetail() {
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const { width } = useWindowDimensions();

  const { data: article, isLoading, isError, error } = useArticlesById(newsId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0070f3" />
          <Text className="mt-4 text-color-body">Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !article) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg text-red-500 mb-2">
            Error loading article
          </Text>
          <Text className="text-color-body text-center">
            {error?.message || "Article not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-4 py-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Article Image */}
      <Image
        source={{ uri: article.imageUrl }}
        className="w-full h-64 rounded-lg mb-4"
        resizeMode="cover"
      />

      {/* Article Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-color-heading mb-3">
          {article.title}
        </Text>

        {/* Meta Information */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <User size={16} color="#6c757d" />
            <Text className="text-color-body ml-2">{article.author.name}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#6c757d" />
            <Text className="text-color-body ml-2">
              {new Date(article.publishedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Categories */}
        {article.categories && article.categories.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {article.categories.map((category, index: number) => (
              <View
                key={category.id}
                className="bg-primary/10 px-2 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-primary text-sm font-medium capitalize">
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Article Content */}
      <View className="mb-8">
        <RenderHTML
          source={{ html: article.content }}
          contentWidth={width - 32}
          baseStyle={{
            fontSize: 16,
            lineHeight: 24,
            color: "#374151", // text-color-body equivalent
          }}
        />
      </View>
    </ScrollView>
  );
}

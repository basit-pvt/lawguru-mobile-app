import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { Clock } from "lucide-react-native";
import { Article } from "@/app/types/articles";
import RenderHTML from "react-native-render-html";
import truncateHtml from "html-truncate";
import { Link, useRouter } from "expo-router";

export default function ListCard({
  imageUrl,
  title,
  content,
  author,
  categories,
  id,
  publishedAt,
  slug,
  updatedAt,
}: Article) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const truncatedContent = truncateHtml(content, 80, {
    stripTags: false,
    ellipsis: "...",
    keepWhitespaces: true,
  });
  return (
    <Link href={`/news/${id}` as any} asChild>
      <TouchableOpacity className="flex-row items-center rounded-xl overflow-hidden shadow-md bg-background-card p-2">
        <Image
          source={{ uri: imageUrl }}
          className="w-[80px] h-[80px] rounded-lg mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text
            className="text-lg font-semibold text-color-heading mb-1"
            numberOfLines={2}
          >
            {title}
          </Text>

          <RenderHTML
            source={{ html: truncatedContent }}
            contentWidth={width} // Adjust based on your layout
          />
          <View className="flex-row items-center mt-1">
            <Clock size={12} color="#6c757d" />
            <Text className="text-caption text-color-muted ml-xs">
              {new Date(publishedAt).toDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

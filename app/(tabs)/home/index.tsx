import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookOpen,
  Bookmark,
  ChevronRight,
  Clock,
  Search,
} from "lucide-react-native";
import { TextInput } from "react-native";
import SearchBar from "@/app/components/ui/SearchBar";
import { Link } from "expo-router";
import Title from "@/app/components/ui/Title";
import ListCard from "@/app/components/cards/ListCard";
import CarouselCard from "@/app/components/cards/CarouselCard";
import { fetchArticles, useArticles } from "@/services/articlesService";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import ErrorMessage from "@/app/components/ui/ErrorMessage";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const { data, error, isLoading, isError } = useArticles();

  // useEffect(() => {
  //   throw new Error("this is an error");
  // }, []);
  if (isLoading) return <Loader fullscreen />;
  if (isError) return <ErrorMessage fullscreen />;

  const breakingNews = data!.articles;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Breaking News Carousel */}
      <View className="mb-4">
        <Title className="px-4 mb-2 mt-4">Breaking News</Title>

        {data?.articles?.length && (
          <FlatList
            data={data.articles}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
            renderItem={({ item }) => <CarouselCard {...item} />}
            pagingEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Quick Access Section */}
      <View className="px-4 mb-4">
        <Text className="text-h2 text-color-heading mb-2">Quick Access</Text>
        <View className="flex-row flex-wrap -mx-2">
          <TouchableOpacity className="w-1/2 px-2 mb-4">
            <View className="bg-primary-light rounded-xl p-4">
              <Bookmark size={24} color="#0070f3" className="mb-2" />
              <Text className="text-h3 text-color-heading mb-xs">Cases</Text>
              <Text className="text-small text-color-muted">
                Browse legal cases
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="w-1/2 px-2 mb-4">
            <View className="bg-success-light rounded-xl p-4">
              <BookOpen size={24} color="#28a745" className="mb-2" />
              <Text className="text-h3 text-color-heading mb-xs">Acts</Text>
              <Text className="text-small text-color-muted">
                Legal acts & laws
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent News Section */}
      <View className="px-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-h2 text-color-heading">Recent News</Text>
          <Link href="/news" asChild>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-small text-primary-DEFAULT font-semibold mr-xs">
                View All
              </Text>
              <ChevronRight size={16} color="#0070f3" />
            </TouchableOpacity>
          </Link>
        </View>

        <FlatList
          data={data?.articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item: update }) => <ListCard {...update} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

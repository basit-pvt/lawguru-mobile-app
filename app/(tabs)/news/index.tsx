import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import ListCard from "@/app/components/cards/ListCard";
import CategoryBadge from "@/app/components/ui/CategoryBadge";
import {
  useInfiniteArticles,
  useCategories,
  Category,
} from "@/services/articlesService";
import { Article } from "@/app/types/articles";
import SearchBar from "@/app/components/ui/SearchBar";
import { LucideSearch } from "lucide-react-native";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch categories from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteArticles({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: debouncedSearch || undefined,
  });

  // Reset list when search or category changes
  React.useEffect(() => {
    refetch();
  }, [debouncedSearch, selectedCategory]);

  // Extract all articles from all pages
  const allArticles = data?.pages.flatMap((page) => page.articles) || [];

  // Prepare categories for display (add "All" option)
  const categories = categoriesData?.categories || [];
  const displayCategories = [
    { id: "All", name: "All", description: "All categories" },
    ...categories,
  ];

  const handleCategoryPress = useCallback((category: Category) => {
    console.log("Category selected:", category.name, category.id);
    setSelectedCategory(category.id);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderArticle = useCallback(
    ({ item }: { item: Article }) => (
      <View className="mb-4">
        <ListCard {...item} />
      </View>
    ),
    []
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#0070f3" />
      </View>
    );
  }, [isFetchingNextPage]);

  // --- Refactored header ---
  const Header = (
    <View>
      <Text className="text-2xl font-bold text-color-heading mb-2  px-4">
        Latest News
      </Text>
      {categoriesLoading ? (
        <View className="py-4">
          <ActivityIndicator size="small" color="#0070f3" />
        </View>
      ) : categoriesError ? (
        <Text className="text-red-500 mb-4 px-4">
          Failed to load categories
        </Text>
      ) : (
        <FlatList
          data={displayCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryBadge
              category={item.name}
              isSelected={selectedCategory === item.id}
              onPress={() => handleCategoryPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryList}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      )}
      <View className="px-4 mb-4">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search news..."
          prefixIcon={<LucideSearch size={20} color="#6c757d" />}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0070f3" />
          <Text className="mt-4 text-color-body">Loading news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 ">
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg text-red-500 mb-2">Error loading news</Text>
          <Text className="text-color-body text-center mb-4">
            {error?.message || "Something went wrong"}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className={clsx("bg-primary px-4 py-2 rounded-lg")}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="py-4">
      {Header}
      <FlatList
        data={allArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#0070f3"]}
            tintColor="#0070f3"
          />
        }
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-8">
            <Text>No news found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingInline: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

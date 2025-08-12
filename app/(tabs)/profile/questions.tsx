import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { Question } from "@/app/types/questions";
import Title from "@/app/components/ui/Title";
import { useInfiniteQuestionsByUserId } from "@/services/questionsService";
import QuestionCard from "@/app/components/cards/QuestionCard";

const PAGE_SIZE = 10;

export default function QuestionsPage() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuestionsByUserId({
    userId: user?.id || "",
    pageSize: PAGE_SIZE,
  });

  const questions = data?.pages.flatMap((page) => page.questions) || [];

  const renderItem = ({ item }: { item: Question }) => (
    <QuestionCard question={item} collapsibleAnswer />
  );

  return (
    <ProtectedRoute>
      <View className="flex-1 p-4 bg-background">
        <Title className="mb-4">My Questions</Title>
        <FlatList
          data={questions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View
              style={{
                minHeight: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#0070f3" />
              ) : !hasNextPage && questions.length > 0 ? (
                <Text style={{ color: "#888", marginTop: 8 }}>
                  No more questions
                </Text>
              ) : null}
            </View>
          }
        />
      </View>
    </ProtectedRoute>
  );
}

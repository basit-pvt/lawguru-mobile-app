import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { Plus, MessageCircle, Clock } from "lucide-react-native";
import {
  useQuestionsByUserId,
  useAskQuestion,
} from "@/services/questionsService";
import Title from "@/app/components/ui/Title";
import Loader from "@/app/components/ui/Loader";
import { Question, QuestionsResponse } from "@/app/types/questions";
import QuestionCard from "@/app/components/cards/QuestionCard";

type AskContentProps = {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  handleAskQuestion: () => void;
  askQuestionMutation: any; // You can further type this if you want
  questionsLoading: boolean;
  questionsError: boolean;
  questionsData?: QuestionsResponse;
};

function AskContent({
  question,
  setQuestion,
  handleAskQuestion,
  askQuestionMutation,
  questionsLoading,
  questionsError,
  questionsData,
}: AskContentProps) {
  // Track expanded answers by question ID
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(
    new Set()
  );

  const toggleExpand = (id: string) => {
    setExpandedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Header
  return (
    <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View className="mb-6">
        <Title>Ask a Question</Title>
        <Text className="text-color-body">
          Get help from legal experts and the community
        </Text>
      </View>

      {/* Ask Question Input */}
      <View className="mb-6">
        <Text className="text-color-heading font-medium mb-2">
          Your Question
        </Text>
        <TextInput
          className="bg-white border-2 border-primary/50 rounded-xl px-4 py-4 text-color-heading text-base min-h-[64px] max-h-[120px]"
          placeholder="What do you want to ask? Be specific..."
          placeholderTextColor="#9ca3af"
          value={question}
          onChangeText={setQuestion}
          multiline
          numberOfLines={3}
          style={{ textAlignVertical: "top" }}
          returnKeyType="done"
          onSubmitEditing={handleAskQuestion}
        />
        <TouchableOpacity
          onPress={handleAskQuestion}
          className={clsx(
            "bg-primary rounded-xl py-3 mt-4 items-center justify-center",
            (question.trim().length === 0 || askQuestionMutation.isPending) &&
              "opacity-50"
          )}
          disabled={
            question.trim().length === 0 || askQuestionMutation.isPending
          }
        >
          <Text className="text-white font-semibold text-lg">
            {askQuestionMutation.isPending ? "Submitting..." : "Ask"}
          </Text>
        </TouchableOpacity>
        {askQuestionMutation.isError && (
          <Text className="text-red-500 mt-2">
            Failed to submit question. Please try again.
          </Text>
        )}
      </View>

      {/* Recent Questions */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-color-heading mb-4">
          Recent Questions
        </Text>
        {questionsLoading && <Loader />}
        {questionsError && (
          <Text className="text-red-500">Failed to load questions.</Text>
        )}
        {questionsData?.questions?.length === 0 && !questionsLoading && (
          <Text className="text-color-muted">No questions found.</Text>
        )}
        {questionsData?.questions?.map((q: Question) => (
          <QuestionCard key={q.id} question={q} collapsibleAnswer />
        ))}
      </View>
    </ScrollView>
  );
}

export default function Ask() {
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState("");
  console.log(user);

  // Fetch questions for the logged-in user
  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
    refetch: refetchQuestions,
  } = useQuestionsByUserId({
    userId: user?.id || "",
  });

  // Mutation for asking a question
  const askQuestionMutation = useAskQuestion();

  const handleAskQuestion = () => {
    if (question.trim().length === 0 || !user?.id) return;
    askQuestionMutation.mutate(
      { question, userId: user.id },
      {
        onSuccess: () => {
          setQuestion("");
          Keyboard.dismiss();
          refetchQuestions();
        },
      }
    );
  };

  return (
    <ProtectedRoute>
      <AskContent
        question={question}
        setQuestion={setQuestion}
        handleAskQuestion={handleAskQuestion}
        askQuestionMutation={askQuestionMutation}
        questionsLoading={questionsLoading}
        questionsError={questionsError}
        questionsData={questionsData}
      />
    </ProtectedRoute>
  );
}

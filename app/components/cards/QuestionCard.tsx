import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";
import { Question } from "@/app/types/questions";
import { clsx } from "clsx";

interface QuestionCardProps {
  question: Question;
  collapsibleAnswer?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  collapsibleAnswer = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasAnswer = !!question.answer;

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
      <Text className="text-color-heading font-semibold mb-2">
        {question.question}
      </Text>
      {hasAnswer && collapsibleAnswer ? (
        <TouchableOpacity
          onPress={() => setExpanded((e) => !e)}
          activeOpacity={0.7}
        >
          <Text
            className="text-color-body text-sm mb-3"
            numberOfLines={expanded ? undefined : 2}
          >
            {question.answer}
          </Text>
          <Text className="text-sm text-primary mb-2">
            {expanded ? "Show less" : "Read more"}
          </Text>
        </TouchableOpacity>
      ) : hasAnswer ? (
        <Text className="text-color-body text-sm mb-3">{question.answer}</Text>
      ) : null}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Clock size={14} color="#6c757d" />
          <Text className="text-color-muted text-sm ml-1">
            {question.answeredAt
              ? new Date(question.answeredAt).toDateString()
              : question.status}
          </Text>
        </View>
        <View
          className={clsx(
            "px-2 py-1 rounded-full",
            question.status === "ANSWERED" ? "bg-success/20" : "bg-yellow-100"
          )}
        >
          <Text
            className={clsx(
              "text-xs font-medium",
              question.status === "ANSWERED"
                ? "text-success"
                : "text-yellow-700"
            )}
          >
            {question.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuestionCard;

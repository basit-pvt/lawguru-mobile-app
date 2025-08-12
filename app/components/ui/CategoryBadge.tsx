import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { clsx } from "clsx";

interface CategoryBadgeProps {
  category: string;
  isSelected: boolean;
  onPress: (category: string) => void;
}

export default function CategoryBadge({
  category,
  isSelected,
  onPress,
}: CategoryBadgeProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(category)}
      className={clsx(
        "px-4 py-2 rounded-full mr-2 mb-2 flex-shrink-0",
        isSelected
          ? "bg-primary border border-primary"
          : "bg-gray-100 border border-gray-200"
      )}
      style={{ minWidth: 60 }}
    >
      <Text
        className={clsx(
          "text-sm font-medium capitalize text-center",
          isSelected ? "text-white" : "text-gray-700"
        )}
        style={{ includeFontPadding: false }}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
}

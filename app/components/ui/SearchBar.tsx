import {
  TextInput,
  View,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React from "react";
import clsx from "clsx";
import { LucideX } from "lucide-react-native";

interface SearchBarProps extends TextInputProps {
  placeholder?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search legal resources...",
  prefixIcon,
  suffixIcon,
  className = "",
  value,
  onChangeText,
  ...textInputProps
}: SearchBarProps) {
  return (
    <View
      className={clsx(
        "flex-row items-center bg-background-card rounded-xl px-4 shadow-sm",
        className
      )}
    >
      {prefixIcon && <View className="mr-2">{prefixIcon}</View>}
      <TextInput
        className="flex-1 h-12 text-body text-color-body"
        placeholder={placeholder}
        placeholderTextColor="#6c757d"
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      {value && value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeText && onChangeText("")}
          className="ml-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LucideX size={20} color="#6c757d" />
        </TouchableOpacity>
      ) : suffixIcon ? (
        <View className="ml-2">{suffixIcon}</View>
      ) : null}
    </View>
  );
}

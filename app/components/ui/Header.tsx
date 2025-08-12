import React from "react";
import { View, Text, Image } from "react-native";
import { User } from "lucide-react-native";
import { Link } from "expo-router";
import clsx from "clsx";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";

interface HeaderProps {
  title: string;
  className?: string;
}

function getInitials(name?: string) {
  if (!name) return "";
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Header({ title, className = "" }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const initials = getInitials(user?.name);
  return (
    <View
      className={clsx(
        "flex-row items-center justify-between bg-background-card px-4 py-3 rounded-b-xl shadow-sm",
        className
      )}
      style={{ paddingTop: insets.top }}
    >
      {/* Logo */}
      <Image
        source={require("../../../assets/images/react-logo.png")}
        className="w-8 h-8"
        resizeMode="contain"
      />
      {/* Title */}
      <Text className="flex-1 text-center text-lg font-bold text-color-heading">
        {title}
      </Text>
      {/* Profile Avatar */}
      <Link href="/profile" asChild>
        {initials ? (
          <View className="ml-2 w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
            <Text className="text-primary font-bold text-lg">{initials}</Text>
          </View>
        ) : (
          <View className="ml-2 w-10 h-10 rounded-full bg-gray-500/20 items-center justify-center">
            <User color="#22223b" className="ml-2" />
          </View>
        )}
      </Link>
    </View>
  );
}

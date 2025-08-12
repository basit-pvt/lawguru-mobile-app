import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import { router } from "expo-router";
import { clsx } from "clsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  console.log({ isAuthenticated });
  const handleLoginPress = () => {
    router.push("/(auth)/login");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0070f3" />
          <Text className="mt-4 text-color-body">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      //   <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
          <Text className="text-2xl font-bold text-color-heading text-center mb-2">
            Login Required
          </Text>
          <Text className="text-color-body text-center mb-6">
            You need to be logged in to access this feature. Please sign in to
            continue.
          </Text>
          <TouchableOpacity
            onPress={handleLoginPress}
            className={clsx("bg-primary py-3 px-6 rounded-lg items-center")}
          >
            <Text className="text-white font-semibold text-center">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      //   </SafeAreaView>
    );
  }

  return <>{children}</>;
}

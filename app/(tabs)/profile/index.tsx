import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  User,
  Settings,
  Bookmark,
  MessageCircle,
  LogOut,
  Edit,
  Shield,
  HelpCircle,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getInitials(name?: string) {
  if (!name) return "";
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // You might want to navigate to login or home screen
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMyQuestions = () => {
    router.push("/profile/questions");
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  const initials = getInitials(user?.name);

  const handleClearTokens = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log("access token", token);
      await AsyncStorage.removeItem("accessToken");
      console.log("removed access token");
    } catch (error) {
      console.log("error while removing access token", error);
    }
  };

  const ProfileContent = () => (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        {/* Profile Header */}
        <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mr-4">
              {initials ? (
                <Text className="text-primary font-bold text-2xl">
                  {initials}
                </Text>
              ) : (
                <User size={24} color="#0070f3" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-color-heading">
                {user?.name}
              </Text>
              <Text className="text-color-body">{user?.email}</Text>
            </View>
            <TouchableOpacity
              className="bg-gray-100 p-2 rounded-full ml-2"
              onPress={handleEdit}
            >
              <Edit size={16} color="#6c757d" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="space-y-2">
          {/* My Questions */}
          <TouchableOpacity
            className={clsx(
              "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
            )}
            onPress={handleMyQuestions}
          >
            <MessageCircle size={20} color="#0070f3" />
            <Text className="text-color-heading font-medium ml-3 flex-1">
              My Questions
            </Text>
          </TouchableOpacity>

          {/* Saved Articles */}
          <TouchableOpacity
            className={clsx(
              "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
            )}
          >
            <Bookmark size={20} color="#0070f3" />
            <Text className="text-color-heading font-medium ml-3 flex-1">
              Saved Articles
            </Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            className={clsx(
              "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
            )}
          >
            <Settings size={20} color="#6c757d" />
            <Text className="text-color-heading font-medium ml-3 flex-1">
              Settings
            </Text>
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity
            className={clsx(
              "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
            )}
          >
            <Shield size={20} color="#6c757d" />
            <Text className="text-color-heading font-medium ml-3 flex-1">
              Privacy & Security
            </Text>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            className={clsx(
              "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
            )}
          >
            <HelpCircle size={20} color="#6c757d" />
            <Text className="text-color-heading font-medium ml-3 flex-1">
              Help & Support
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className={clsx(
              "bg-red-50 rounded-xl p-4 flex-row items-center shadow-sm border border-red-100"
            )}
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="text-red-600 font-medium ml-3 flex-1">Logout</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            className={clsx(
              "bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
            )}
            onPress={handleClearTokens}
          >
            <MessageCircle size={20} color="#0070f3" />
            <Text className="text-color-heading font-medium ml-3 flex-1">
              Clear Tokens
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="mt-8 items-center">
          <Text className="text-color-muted text-sm">LawGuru v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

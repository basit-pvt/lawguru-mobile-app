import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { Link, router } from "expo-router";
import { clsx } from "clsx";
import { useAuth } from "@/app/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { loginApi, LoginPayload } from "@/services/authService";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: async (result) => {
      console.log("Login API successful:", result);

      // Validate response structure
      if (!result.user) {
        Alert.alert("Login Error", "User data not received from server");
        return;
      }

      if (!result.tokens) {
        Alert.alert("Login Error", "Authentication tokens not received");
        return;
      }

      try {
        // Context handles storage and state management
        await login(result.user, result.tokens);

        // Navigate to home screen
        router.replace("/(tabs)/home");
      } catch (error: any) {
        Alert.alert(
          "Login Error",
          error.message || "Failed to save login data"
        );
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Login Failed",
        error?.message || "Invalid email or password. Please try again."
      );
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-1 justify-center">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-color-heading mb-2">
                Welcome Back
              </Text>
              <Text className="text-color-body text-lg">
                Sign in to your account to continue
              </Text>
            </View>

            {/* Login Form */}
            <View className="flex-col gap-3">
              {/* Email Field */}
              <View>
                <Text className="text-color-heading font-medium mb-2">
                  Email Address
                </Text>
                <View className="relative">
                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={clsx(
                          "bg-white border rounded-xl px-4 py-4 pl-12 text-color-heading",
                          errors.email ? "border-red-500" : "border-gray-200"
                        )}
                        placeholder="Enter your email"
                        placeholderTextColor="#9ca3af"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    )}
                  />
                  <Mail
                    size={20}
                    color="#6c757d"
                    style={{ position: "absolute", left: 16, top: 13 }}
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View>
                <Text className="text-color-heading font-medium mb-2">
                  Password
                </Text>
                <View className="relative">
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={clsx(
                          "bg-white border rounded-xl px-4 py-4 pl-12 pr-12 text-color-heading",
                          errors.password ? "border-red-500" : "border-gray-200"
                        )}
                        placeholder="Enter your password"
                        placeholderTextColor="#9ca3af"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                    )}
                  />
                  <Lock
                    size={20}
                    color="#6c757d"
                    style={{ position: "absolute", left: 16, top: 13 }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 16, top: 14 }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6c757d" />
                    ) : (
                      <Eye size={20} color="#6c757d" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-primary font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={mutation.isPending}
                className={clsx(
                  "bg-primary py-4 rounded-xl items-center mt-6",
                  mutation.isPending && "opacity-50"
                )}
              >
                {mutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-color-body">Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-medium">Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

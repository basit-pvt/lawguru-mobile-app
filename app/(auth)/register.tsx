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
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { registerApi, RegisterPayload } from "@/services/authService";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "USER" | "LAWYER";
  lawyerId?: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "USER",
      lawyerId: "",
    },
  });

  const watchedUserType = watch("userType");
  const watchedPassword = watch("password");

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (result) => {
      console.log("register result", result);
      Alert.alert("Account Created", "Please login", [
        { text: "Log in", onPress: () => router.replace("/(auth)/login") },
      ]);
      // await login(result.user, result.tokens?.jwt);
    },
    onError: (error: any) => {
      Alert.alert(
        "Registration Failed",
        error?.message || "Something went wrong. Please try again."
      );
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      userType: data.userType,
      lawyerId: data.userType === "USER" ? data.lawyerId : undefined,
    });
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
                Create Account
              </Text>
              <Text className="text-color-body text-lg">
                Join LawGuru to get started
              </Text>
            </View>

            {/* Register Form */}
            <View className="flex-col gap-4">
              {/* Name Field */}
              <View>
                <Text className="text-color-heading font-medium mb-2">
                  Full Name
                </Text>
                <View className="relative">
                  <Controller
                    control={control}
                    name="name"
                    rules={{
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={clsx(
                          "bg-white border rounded-xl px-4 py-4 pl-12 text-color-heading",
                          errors.name ? "border-red-500" : "border-gray-200"
                        )}
                        placeholder="Enter your full name"
                        placeholderTextColor="#9ca3af"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="words"
                      />
                    )}
                  />
                  <User
                    size={20}
                    color="#6c757d"
                    style={{ position: "absolute", left: 16, top: 13 }}
                  />
                </View>
                {errors.name && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </Text>
                )}
              </View>

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
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={clsx(
                          "bg-white border rounded-xl px-4 py-4 pl-12 pr-12 text-color-heading",
                          errors.password ? "border-red-500" : "border-gray-200"
                        )}
                        placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <View>
                <Text className="text-color-heading font-medium mb-2">
                  Confirm Password
                </Text>
                <View className="relative">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watchedPassword || "Passwords do not match",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={clsx(
                          "bg-white border rounded-xl px-4 py-4 pl-12 pr-12 text-color-heading",
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-200"
                        )}
                        placeholder="Confirm your password"
                        placeholderTextColor="#9ca3af"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showConfirmPassword}
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
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: "absolute", right: 16, top: 14 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6c757d" />
                    ) : (
                      <Eye size={20} color="#6c757d" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* User Type Selection */}
              <View>
                <Text className="text-color-heading font-medium mb-2">
                  I am a
                </Text>
                <View className="flex-row gap-3">
                  <Controller
                    control={control}
                    name="userType"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => onChange("USER")}
                          className={clsx(
                            "flex-1 py-3 px-4 rounded-xl border",
                            value === "USER"
                              ? "bg-primary border-primary"
                              : "bg-white border-gray-200"
                          )}
                        >
                          <Text
                            className={clsx(
                              "text-center font-medium",
                              value === "USER"
                                ? "text-white"
                                : "text-color-heading"
                            )}
                          >
                            User
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => onChange("LAWYER")}
                          className={clsx(
                            "flex-1 py-3 px-4 rounded-xl border",
                            value === "LAWYER"
                              ? "bg-primary border-primary"
                              : "bg-white border-gray-200"
                          )}
                        >
                          <Text
                            className={clsx(
                              "text-center font-medium",
                              value === "LAWYER"
                                ? "text-white"
                                : "text-color-heading"
                            )}
                          >
                            Lawyer
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  />
                </View>
              </View>

              {/* Lawyer ID Field (Conditional) */}
              {watchedUserType === "LAWYER" && (
                <View>
                  <Text className="text-color-heading font-medium mb-2">
                    Lawyer ID
                  </Text>
                  <View className="relative">
                    <Controller
                      control={control}
                      name="lawyerId"
                      rules={{
                        required:
                          watchedUserType === "LAWYER"
                            ? "Lawyer ID is required"
                            : false,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={clsx(
                            "bg-white border rounded-xl px-4 py-4 pl-12 text-color-heading",
                            errors.lawyerId
                              ? "border-red-500"
                              : "border-gray-200"
                          )}
                          placeholder="Enter your lawyer ID"
                          placeholderTextColor="#9ca3af"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoCapitalize="none"
                        />
                      )}
                    />
                    <Shield
                      size={20}
                      color="#6c757d"
                      style={{ position: "absolute", left: 16, top: 13 }}
                    />
                  </View>
                  {errors.lawyerId && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.lawyerId.message}
                    </Text>
                  )}
                </View>
              )}

              {/* Register Button */}
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
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-color-body">
                  Already have an account?{" "}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-medium">Sign In</Text>
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

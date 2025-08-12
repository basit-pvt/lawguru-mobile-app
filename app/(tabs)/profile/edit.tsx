import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { updateUserApi } from "@/services/authService";
import { useCategories } from "@/services/articlesService";
import { Category } from "@/app/types/user";
import { clsx } from "clsx";

interface FormData {
  name: string;
  preferredCategories: Category[];
}

export default function EditProfile() {
  const { user, updateUserInContext } = useAuth();
  const { data: categoriesData, isLoading } = useCategories();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "",
      preferredCategories: user?.preferredCategories || [],
    },
  });

  const selectedCategories = watch("preferredCategories");

  const handleToggleCategory = (
    category: Category,
    onChange: (value: Category[]) => void
  ) => {
    const current = selectedCategories;
    const isSelected = current.some((cat) => cat.id === category.id);

    if (isSelected) {
      onChange(current.filter((cat) => cat.id !== category.id));
    } else {
      onChange([...current, category]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await updateUserApi({
        userId: user?.id || "",
        name: data.name,
        preferredCategories: data.preferredCategories.map(
          (category) => category.id
        ),
      });
      await updateUserInContext({
        name: data.name,
        preferredCategories: data.preferredCategories,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
  };

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          <Text className="text-xl font-bold mb-4 text-color-heading">
            Edit Profile
          </Text>
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
            <View>
              <Text className="text-color-heading font-medium text-lg mb-2">
                Name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      "bg-gray-100 border rounded-xl px-4 py-3 text-color-heading text-base",
                      errors.name ? "border-red-500" : "border-gray-200"
                    )}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your name"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-color-heading font-medium text-lg mb-2">
                Email
              </Text>
              <TextInput
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-color-heading text-base"
                value={user?.email}
                editable={false}
              />
            </View>

            <View>
              <Text className="text-color-heading font-medium text-lg mb-2">
                Preferred Categories
              </Text>
              {isLoading ? (
                <Text className="text-color-muted">Loading categories...</Text>
              ) : (
                <Controller
                  control={control}
                  name="preferredCategories"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row flex-wrap gap-x-2 gap-y-4">
                      {categoriesData?.categories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          onPress={() =>
                            handleToggleCategory(category, onChange)
                          }
                          className={clsx(
                            "px-3 py-1 rounded-full border",
                            value.some((cat) => cat.id === category.id)
                              ? "bg-primary border-primary"
                              : "bg-gray-100 border-gray-200"
                          )}
                        >
                          <Text
                            className={clsx(
                              "font-medium capitalize",
                              value.some((cat) => cat.id === category.id)
                                ? "text-white"
                                : "text-color-heading"
                            )}
                          >
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className={clsx(
                "rounded-xl py-3 items-center justify-center",
                !isDirty ? "bg-primary/40" : "bg-primary"
              )}
              disabled={!isDirty}
            >
              <Text className="text-white font-semibold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}

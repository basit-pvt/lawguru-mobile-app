import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Stack screenOptions={{ headerShown: false }}>{children}</Stack>;
}

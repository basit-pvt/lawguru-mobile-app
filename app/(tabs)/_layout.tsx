import React from "react";
import { ErrorBoundaryProps, Tabs } from "expo-router";
import { Home, User, Newspaper, CircleQuestionMark } from "lucide-react-native";
import Header from "../components/ui/Header";
import { SafeAreaView, Text, View } from "react-native";
import ErrorMessage from "../components/ui/ErrorMessage";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0070f3",
        tabBarInactiveTintColor: "#6c757d",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e9ecef",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#1a1a1a",
      }}
      initialRouteName="home/index"
    >
      <Tabs.Screen
        name="home/index"
        options={{
          header: () => <Header title="Home" />,
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Home color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="news/index"
        options={{
          header: () => <Header title="News" />,
          title: "News",
          tabBarIcon: ({ color, focused }) => (
            <Newspaper color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="ask/index"
        options={{
          header: () => <Header title="Ask" />,
          title: "Ask",
          tabBarIcon: ({ color, focused }) => (
            <CircleQuestionMark color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          header: () => <Header title="Profile" />,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <User color={color} size={24} />,
        }}
      />

      {/* Hide nested routes from tab bar */}
      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />

      <Tabs.Screen
        name="profile/questions"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />

      <Tabs.Screen
        name="news/[newsId]"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorMessage fullscreen message={error.message} onRetry={retry} />;
}

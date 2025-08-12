import React from "react";
import { ErrorBoundaryProps, Tabs } from "expo-router";
import {
  Home,
  Search,
  Bookmark,
  User,
  BookOpen,
  Newspaper,
  CircleQuestionMark,
} from "lucide-react-native";
import Header from "../components/ui/Header";
import { SafeAreaView, Text, View } from "react-native";
import ErrorMessage from "../components/ui/ErrorMessage";

const TabLayout = () => {
  const tabs = [
    {
      name: "home/index",
      title: "Home",
      icon: <Home color={"black"} />,
    },
    {
      name: "news/index",
      title: "News",
      icon: <Newspaper color={"black"} />,
    },
    {
      name: "ask/index",
      title: "Ask",
      icon: <CircleQuestionMark color={"black"} />,
    },

    {
      name: "profile/index",
      title: "Profile",
      icon: <User color={"black"} />,
    },
    {
      name: "cases/index",
      title: "Cases",
      icon: <Bookmark color={"black"} />,
      href: null,
    },
    {
      name: "acts/index",
      title: "Acts",
      icon: <BookOpen color={"black"} />,
      href: null,
    },
    {
      name: "news/[newsId]",
      title: "News",
      icon: <BookOpen color={"black"} />,
      href: null,
    },
    {
      name: "profile/edit",
      href: null,
      icon: <User />,
      title: "Edit Profile",
    },
    {
      name: "profile/questions",
      href: null,
      icon: <User />,
      title: "Questions",
    },
  ];
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
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          name={tab.name}
          options={{
            header: () => <Header title={tab.title} />,
            title: tab.title,
            tabBarIcon: ({ color, focused }) =>
              React.cloneElement(tab.icon, {
                color,
              }),
            href: tab?.href,
          }}
          key={tab.name}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorMessage fullscreen message={error.message} onRetry={retry} />;
}

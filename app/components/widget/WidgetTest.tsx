import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { updateWidgetData } from "../../services/WidgetDataService";

// Mock article data for testing
const mockArticle = {
  id: "test-123",
  title: "Test Article: LawGuru Widget Test",
  imageUrl: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Test+Image",
  content: "This is a test article to verify the widget is working correctly.",
  publishedAt: new Date().toISOString(),
  category: "Test",
};

export const WidgetTest: React.FC = () => {
  const testWidgetUpdate = async () => {
    try {
      await updateWidgetData([mockArticle]);
      Alert.alert(
        "Success",
        "Widget data updated successfully! Check your home screen widget.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", `Failed to update widget: ${error}`, [
        { text: "OK" },
      ]);
    }
  };

  const testWithRealData = async () => {
    try {
      // This would typically come from your news API
      const realArticle = {
        id: "real-456",
        title: "Breaking: New Legal Framework Announced",
        imageUrl:
          "https://via.placeholder.com/300x200/28A745/FFFFFF?text=Legal+News",
        content:
          "A new legal framework has been announced that will impact various sectors.",
        publishedAt: new Date().toISOString(),
        category: "Legal",
      };

      await updateWidgetData([realArticle]);
      Alert.alert("Success", "Real article data sent to widget!", [
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("Error", `Failed to update widget with real data: ${error}`, [
        { text: "OK" },
      ]);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        Widget Test Component
      </Text>

      <Text style={{ marginBottom: 20, color: "#666" }}>
        Use these buttons to test the home screen widget functionality. Make
        sure you have added the widget to your home screen first.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#4A90E2",
          padding: 15,
          borderRadius: 8,
          marginBottom: 15,
          alignItems: "center",
        }}
        onPress={testWidgetUpdate}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Test Widget with Mock Data
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#28A745",
          padding: 15,
          borderRadius: 8,
          marginBottom: 15,
          alignItems: "center",
        }}
        onPress={testWithRealData}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Test Widget with Real Data
        </Text>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Test Article Preview:
        </Text>
        <Text style={{ marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold" }}>Title:</Text> {mockArticle.title}
        </Text>
        <Text style={{ marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold" }}>Category:</Text>{" "}
          {mockArticle.category}
        </Text>
        <Text style={{ marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold" }}>Content:</Text>{" "}
          {mockArticle.content}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 20,
          fontSize: 12,
          color: "#999",
          textAlign: "center",
        }}
      >
        Note: The widget may take a few minutes to update after pressing the
        test buttons. You may need to manually refresh the widget or wait for
        the automatic update cycle.
      </Text>
    </View>
  );
};

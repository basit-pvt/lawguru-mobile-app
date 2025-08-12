import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bookmark, Clock, ChevronRight, Search } from "lucide-react-native";

type LegalCase = {
  id: string;
  title: string;
  court: string;
  date: string;
  imageUrl: string;
  category: string;
  summary: string;
};

const legalCases: LegalCase[] = [
  {
    id: "1",
    title: "Landmark Privacy Rights Case",
    court: "Supreme Court of India",
    date: "2024-03-15",
    imageUrl: "https://picsum.photos/id/1016/400/300",
    category: "Privacy Rights",
    summary:
      "A landmark case that redefined digital privacy rights in India, setting new precedents for data protection.",
  },
  {
    id: "2",
    title: "Environmental Protection Act Violation",
    court: "High Court of Delhi",
    date: "2024-03-10",
    imageUrl: "https://picsum.photos/id/1019/400/300",
    category: "Environmental Law",
    summary:
      "Major corporation fined for violating environmental protection laws, setting a precedent for corporate responsibility.",
  },
  {
    id: "3",
    title: "Consumer Rights Protection Case",
    court: "National Consumer Disputes Redressal Commission",
    date: "2024-03-05",
    imageUrl: "https://picsum.photos/id/1080/400/300",
    category: "Consumer Rights",
    summary:
      "Landmark judgment strengthening consumer protection laws and setting new standards for service providers.",
  },
];

export default function Cases() {
  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-h1 text-color-heading">Legal Cases</Text>
        <Text className="text-body text-color-muted mt-xs">
          Recent and important legal cases
        </Text>
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-background-card rounded-xl px-4 shadow-sm">
          <Search size={20} color="#6c757d" className="mr-2" />
          <TextInput
            className="flex-1 h-12 text-body text-color-body"
            placeholder="Search cases..."
            placeholderTextColor="#6c757d"
          />
        </View>
      </View>

      <FlatList
        data={legalCases}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="rounded-xl overflow-hidden mb-4 shadow-md bg-background-card">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-full h-[180px]"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="px-2 py-0.5 rounded-full bg-primary-light">
                  <Text className="text-caption text-primary-DEFAULT font-semibold">
                    {item.category}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={12} color="#6c757d" />
                  <Text className="text-caption text-color-muted ml-xs">
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text className="text-h3 text-color-heading mb-xs">
                {item.title}
              </Text>
              <Text className="text-body text-color-body mb-md">
                {item.summary}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-small text-color-muted">
                  {item.court}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-small text-primary-DEFAULT font-semibold mr-xs">
                    Read More
                  </Text>
                  <ChevronRight size={16} color="#0070f3" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

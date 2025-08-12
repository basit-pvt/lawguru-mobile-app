import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, Calendar, ChevronRight, Search } from "lucide-react-native";

type LegalAct = {
  id: string;
  title: string;
  year: string;
  description: string;
  imageUrl: string;
  category: string;
  status: string;
};

const legalActs: LegalAct[] = [
  {
    id: "1",
    title: "Digital Personal Data Protection Act, 2023",
    year: "2023",
    description:
      "A comprehensive legislation to protect personal data and establish a Data Protection Board of India.",
    imageUrl: "https://picsum.photos/id/1016/400/300",
    category: "Data Protection",
    status: "Active",
  },
  {
    id: "2",
    title: "Consumer Protection Act, 2019",
    year: "2019",
    description:
      "Modernized consumer protection law with provisions for e-commerce and product liability.",
    imageUrl: "https://picsum.photos/id/1019/400/300",
    category: "Consumer Rights",
    status: "Active",
  },
  {
    id: "3",
    title: "Companies Act, 2013",
    year: "2013",
    description:
      "Regulates incorporation, operation, and winding up of companies in India.",
    imageUrl: "https://picsum.photos/id/1080/400/300",
    category: "Corporate Law",
    status: "Active",
  },
];

export default function Acts() {
  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-h1 text-color-heading">Legal Acts</Text>
        <Text className="text-body text-color-muted mt-xs">
          Important legal acts and legislations
        </Text>
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-background-card rounded-xl px-4 shadow-sm">
          <Search size={20} color="#6c757d" className="mr-2" />
          <TextInput
            className="flex-1 h-12 text-body text-color-body"
            placeholder="Search acts..."
            placeholderTextColor="#6c757d"
          />
        </View>
      </View>

      <FlatList
        data={legalActs}
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
                <View className="px-2 py-0.5 rounded-full bg-success-light">
                  <Text className="text-caption text-success-DEFAULT font-semibold">
                    {item.category}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Calendar size={12} color="#6c757d" />
                  <Text className="text-caption text-color-muted ml-xs">
                    {item.year}
                  </Text>
                </View>
              </View>
              <Text className="text-h3 text-color-heading mb-xs">
                {item.title}
              </Text>
              <Text className="text-body text-color-body mb-md">
                {item.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className={`w-2 h-2 rounded-full mr-1 ${
                      item.status === "Active"
                        ? "bg-success-DEFAULT"
                        : "bg-secondary-DEFAULT"
                    }`}
                  />
                  <Text className="text-small text-color-muted">
                    {item.status}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-small text-primary-DEFAULT font-semibold mr-xs">
                    View Details
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

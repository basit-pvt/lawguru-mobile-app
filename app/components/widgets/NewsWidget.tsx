
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Article } from '@/app/types/articles';

interface NewsWidgetProps {
  articles: Article[];
  loading: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  articleContainer: {
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 16,
  },
});

export const NewsWidget: React.FC<NewsWidgetProps> = ({ articles, loading }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest News</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleContainer}>
            <Text style={styles.articleTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

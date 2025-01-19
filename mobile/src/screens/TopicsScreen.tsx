import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Topic = {
  id: string;
  name: string;
  description: string;
  progress?: {
    correctStreak: number;
    completed: boolean;
  };
};

const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'World War II',
    description: 'Major events and figures of World War II',
    progress: {
      correctStreak: 5,
      completed: false,
    },
  },
  // Add more mock topics here
];

export default function TopicsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={styles.topicCard}
      onPress={() => navigation.navigate('TopicQuiz', { 
        topicId: item.id,
        topicName: item.name,
      })}
    >
      <View>
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicDescription}>{item.description}</Text>
        {item.progress && (
          <View style={styles.progressBar}>
            <Text style={styles.progressText}>
              Streak: {item.progress.correctStreak}/20
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockTopics}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
  },
  topicCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 24,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#495057',
  },
});

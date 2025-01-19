import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useData } from '../context/DataContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { OfflineNotice } from '../components/OfflineNotice';
import { SyncIndicator } from '../components/SyncIndicator';
import Animated, { FadeInRight } from 'react-native-reanimated';

type Topic = {
  id: string;
  name: string;
  description: string;
  progress?: {
    correctStreak: number;
    completed: boolean;
  };
};

export default function TopicsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { topics, loading, error, syncStatus, syncData } = useData();

  const renderTopic = ({ item, index }: { item: Topic; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
    >
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
    </Animated.View>
  );

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load topics"
        onRetry={syncData}
        fullscreen
      />
    );
  }

  return (
    <View style={styles.container}>
      {syncStatus === 'error' && <SyncIndicator status="error" />}
      {syncStatus === 'syncing' && <SyncIndicator status="syncing" />}
      
      <FlatList
        data={topics}
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topic, Question, Progress, UserStats } from './api';

const KEYS = {
  TOPICS: 'topics',
  QUESTIONS: 'questions',
  PROGRESS: 'progress',
  STATS: 'stats',
  LAST_SYNC: 'lastSync',
} as const;

class StorageService {
  async getTopics(): Promise<Topic[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TOPICS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting topics from storage:', error);
      return [];
    }
  }

  async setTopics(topics: Topic[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
    } catch (error) {
      console.error('Error saving topics to storage:', error);
    }
  }

  async getQuestionsByTopic(topicId: string): Promise<Question[]> {
    try {
      const data = await AsyncStorage.getItem(`${KEYS.QUESTIONS}_${topicId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting questions from storage:', error);
      return [];
    }
  }

  async setQuestionsByTopic(topicId: string, questions: Question[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${KEYS.QUESTIONS}_${topicId}`,
        JSON.stringify(questions)
      );
    } catch (error) {
      console.error('Error saving questions to storage:', error);
    }
  }

  async getProgress(): Promise<Record<string, Progress>> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting progress from storage:', error);
      return {};
    }
  }

  async setProgress(progress: Record<string, Progress>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to storage:', error);
    }
  }

  async getStats(): Promise<UserStats | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.STATS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting stats from storage:', error);
      return null;
    }
  }

  async setStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats to storage:', error);
    }
  }

  async getLastSyncTime(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LAST_SYNC);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('Error getting last sync time from storage:', error);
      return 0;
    }
  }

  async setLastSyncTime(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('Error saving last sync time to storage:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storage = new StorageService();

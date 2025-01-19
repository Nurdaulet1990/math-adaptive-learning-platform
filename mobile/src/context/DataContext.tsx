import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Topic, Question, Progress, UserStats, topicsApi, questionsApi, progressApi } from '../services/api';
import { storage } from '../services/storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  topics: Topic[];
  currentTopic: Topic | null;
  questions: Question[];
  progress: Record<string, Progress>;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  loadTopic: (topicId: string) => Promise<void>;
  submitAnswer: (questionId: string, answer: number) => Promise<boolean>;
  syncData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  useEffect(() => {
    if (user) {
      loadInitialData();
      setupSyncInterval();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Load cached data first
      const [cachedTopics, cachedProgress, cachedStats] = await Promise.all([
        storage.getTopics(),
        storage.getProgress(),
        storage.getStats(),
      ]);

      setTopics(cachedTopics);
      setProgress(cachedProgress);
      setStats(cachedStats);

      // Then try to sync with server
      await syncData();
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const setupSyncInterval = () => {
    const interval = setInterval(async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        syncData();
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  };

  const syncData = async () => {
    try {
      setSyncStatus('syncing');
      const lastSync = await storage.getLastSyncTime();
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      // Fetch all updated data from server
      const [newTopics, newStats] = await Promise.all([
        topicsApi.getAll(),
        progressApi.getStats(),
      ]);

      // Update local storage and state
      await Promise.all([
        storage.setTopics(newTopics.data),
        storage.setStats(newStats.data),
        storage.setLastSyncTime(Date.now()),
      ]);

      setTopics(newTopics.data);
      setStats(newStats.data);
      setSyncStatus('idle');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  const loadTopic = async (topicId: string) => {
    try {
      setLoading(true);
      // First try to load from cache
      const cachedQuestions = await storage.getQuestionsByTopic(topicId);
      if (cachedQuestions.length > 0) {
        setQuestions(cachedQuestions);
      }

      // Then try to fetch fresh data
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        const response = await questionsApi.getByTopic(topicId);
        await storage.setQuestionsByTopic(topicId, response.data);
        setQuestions(response.data);
      }

      const topic = topics.find(t => t.id === topicId);
      setCurrentTopic(topic || null);
    } catch (error) {
      console.error('Error loading topic:', error);
      setError('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId: string, answer: number): Promise<boolean> => {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      const response = await questionsApi.submitAnswer(questionId, answer);
      return response.data.correct;
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer');
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        topics,
        currentTopic,
        questions,
        progress,
        stats,
        loading,
        error,
        syncStatus,
        loadTopic,
        submitAnswer,
        syncData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

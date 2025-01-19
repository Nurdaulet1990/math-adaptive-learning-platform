import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Topic {
  id: string;
  name: string;
  description: string;
  parentId?: string;
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Progress {
  topicId: string;
  correctStreak: number;
  questionsTotal: number;
  correctTotal: number;
  completed: boolean;
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  completedTopics: number;
  currentStreak: number;
  bestStreak: number;
}

export const topicsApi = {
  getAll: () => api.get<Topic[]>('/topics'),
  getById: (id: string) => api.get<Topic>(`/topics/${id}`),
};

export const questionsApi = {
  getByTopic: (topicId: string) => 
    api.get<Question[]>(`/topics/${topicId}/questions`),
  getRandomQuestion: (topicId?: string) => 
    api.get<Question>(`/questions/random${topicId ? `?topicId=${topicId}` : ''}`),
  submitAnswer: (questionId: string, answer: number) =>
    api.post<{ correct: boolean; explanation: string }>(`/questions/${questionId}/answer`, { answer }),
};

export const progressApi = {
  getByTopic: (topicId: string) => 
    api.get<Progress>(`/progress/${topicId}`),
  getStats: () => 
    api.get<UserStats>('/progress/stats'),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post<{ token: string; user: any }>('/auth/register', { email, password, name }),
  logout: () => AsyncStorage.removeItem('token'),
};

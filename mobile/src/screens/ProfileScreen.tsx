import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

type Stats = {
  totalQuestions: number;
  correctAnswers: number;
  completedTopics: number;
  currentStreak: number;
  bestStreak: number;
};

const mockStats: Stats = {
  totalQuestions: 50,
  correctAnswers: 35,
  completedTopics: 2,
  currentStreak: 5,
  bestStreak: 15,
};

export default function ProfileScreen() {
  const accuracy = Math.round((mockStats.correctAnswers / mockStats.totalQuestions) * 100) || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mockStats.totalQuestions}</Text>
          <Text style={styles.statLabel}>Questions Answered</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mockStats.completedTopics}</Text>
          <Text style={styles.statLabel}>Topics Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mockStats.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mockStats.bestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statsContainer: {
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

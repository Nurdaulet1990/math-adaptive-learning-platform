import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  SlideInUp,
  SlideOutUp,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  status: 'syncing' | 'error';
}

export function SyncIndicator({ status }: Props) {
  const icon = status === 'syncing' ? 'sync' : 'warning';
  const message = status === 'syncing' 
    ? 'Syncing your progress...'
    : 'Sync failed. Will retry soon...';
  const color = status === 'syncing' ? '#007AFF' : '#dc3545';

  return (
    <Animated.View 
      style={[styles.container, { backgroundColor: color }]}
      entering={SlideInUp.duration(500)}
      exiting={SlideOutUp.duration(500)}
    >
      <Ionicons name={icon} size={20} color="white" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

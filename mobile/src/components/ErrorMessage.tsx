import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  message: string;
  onRetry?: () => void;
  fullscreen?: boolean;
}

export function ErrorMessage({ 
  message,
  onRetry,
  fullscreen = false,
}: Props) {
  const Container = fullscreen ? View : Animated.View;
  const containerStyle = fullscreen ? styles.fullscreen : styles.container;

  return (
    <Container 
      style={containerStyle}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Ionicons name="alert-circle" size={48} color="#dc3545" />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff1f0',
    borderRadius: 12,
    margin: 16,
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

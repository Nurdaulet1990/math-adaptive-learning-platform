import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface Props {
  size?: number | 'small' | 'large';
  color?: string;
  fullscreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'large',
  color = '#007AFF',
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
      <ActivityIndicator size={size} color={color} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export function OfflineNotice() {
  return (
    <Animated.View 
      style={styles.container}
      entering={SlideInDown.duration(500)}
      exiting={SlideOutDown.duration(500)}
    >
      <Ionicons name="cloud-offline" size={20} color="white" />
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#495057',
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

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_TOKEN_KEY = 'pushToken';
const REMINDER_ID = 'dailyReminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token.data);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }

  async scheduleDailyReminder(hour: number, minute: number) {
    try {
      // Cancel any existing reminder
      await this.cancelDailyReminder();

      // Schedule new reminder
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Learn History! 📚",
          body: "Don't break your streak! Take a quick quiz now.",
          data: { type: 'reminder' },
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
        identifier: REMINDER_ID,
      });

      // Save reminder settings
      await AsyncStorage.setItem('reminderSettings', JSON.stringify({ hour, minute }));
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }

  async cancelDailyReminder() {
    try {
      await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
      await AsyncStorage.removeItem('reminderSettings');
    } catch (error) {
      console.error('Error canceling reminder:', error);
      throw error;
    }
  }

  async getReminderSettings() {
    try {
      const settings = await AsyncStorage.getItem('reminderSettings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting reminder settings:', error);
      return null;
    }
  }

  async sendLocalNotification(title: string, body: string) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }
}

export const notificationService = new NotificationService();

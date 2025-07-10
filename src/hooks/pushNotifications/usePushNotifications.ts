import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthActions, useAuthStore } from '../../state/user/authStore';
import { messaging } from './firebase';
import { requestPushNotificationsAccess } from './requestPushNotificationsAccess';

export const usePushNotifications = (enabled: boolean) => {
  const existingToken = useAuthStore((s) => s.pushNotifications.token);
  const { savePushNotificationsToken } = useAuthActions();

  const subscribe = useCallback(async () => {
    const isGranted = await requestPushNotificationsAccess();

    if (isGranted) {
      const FCMPushToken = await messaging.getToken();
      console.log('FCMPushToken', FCMPushToken);
      if (existingToken !== FCMPushToken) {
        await savePushNotificationsToken(FCMPushToken);
      }

      messaging.onTokenRefresh(async (newToken) => {
        console.log('[FCM PUSH TOKEN UPDATED]', newToken);
        await savePushNotificationsToken(newToken);
      });
    }
  }, [existingToken, savePushNotificationsToken]);

  useEffect(() => {
    if (enabled) {
      subscribe();
    }
  }, [enabled, subscribe]);

  useEffect(() => {
    return messaging.onMessage(async (remoteMessage) => {
      console.log('REMOTE MESSAGE', remoteMessage);
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
  }, []);
};

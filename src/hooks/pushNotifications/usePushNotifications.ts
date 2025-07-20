import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthActions, useAuthStore } from '../../state/user/authStore';
import { messaging } from './firebase';
import { handlePushNotification } from './handlePushNotification';
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
    if (!enabled) {
      return () => {};
    }

    const checkInitialNotification = async () => {
      const message = await messaging.getInitialNotification();
      if (message) {
        console.log('[Push] initial notification', message);
        await handlePushNotification(message);
      }
    };

    checkInitialNotification();

    const unsubscribeOnMessage = messaging.onMessage(async (message) => {
      console.log('[Push] onMessage', message);
      // handle something like in app message view with onPress?
      // await handlePushNotification(message);
    });

    const unsubscribeOpenApp = messaging.onNotificationOpenedApp(async (message) => {
      console.log('[Push] onNotificationOpenedApp', message);
      await handlePushNotification(message);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpenApp();
    };
  }, [enabled]);
};

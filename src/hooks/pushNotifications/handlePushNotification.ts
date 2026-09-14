import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { navigationRef } from '../../navigation/navigationRef';
import { NotificationDataType } from './notificationDataType';
import { routeNotification } from './routeNotification';

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

export const handlePushNotification = async (message: RemoteMessage) => {
  const { data } = message as RemoteMessage & { data: NotificationDataType };

  // wait navigation to be ready
  if (!navigationRef.isReady()) {
    let unsubscribe = navigationRef.addListener('ready', () => {
      handlePushNotification(message);
      unsubscribe();
    });
    return;
  }

  routeNotification(data);
};

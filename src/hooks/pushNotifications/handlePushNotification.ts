import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { navigationRef } from '../../navigation/navigationRef';
import { Screens } from '../../navigation/screens';
import { MessageType, NotificationDataType } from './notificationDataType';

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

  switch (data.type) {
    case MessageType.Chat:
      navigationRef.navigate(Screens.Chat, {
        chatId: data.chatId,
        userId: data.userId,
      });
      break;

    case MessageType.Follow:
      navigationRef.navigate(Screens.Profile, {
        fromTabs: false,
        userId: data.userId,
      });
      break;

    case MessageType.VideoComment:
      navigationRef.navigate(Screens.VideoModal, {
        videoId: data.videoId,
        commentId: data.commentId,
      });
      break;

    case MessageType.VideoLike:
      navigationRef.navigate(Screens.VideoModal, {
        videoId: data.videoId,
      });
      break;

    default:
      console.error('Unable to handle notification', data);
  }
};

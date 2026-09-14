import { useCallback } from 'react';
import {
  MessageType,
  NotificationDataType,
} from '../../../hooks/pushNotifications/notificationDataType';
import { routeNotification } from '../../../hooks/pushNotifications/routeNotification';
import { NotificationItem } from '../types';

/**
 * Maps an in-app notification row to the shared push-tap router, so tapping a
 * notification in the center lands on the exact same destination a push tap
 * would — the two can't drift because they call one routeNotification.
 *
 * Marking-read is done by the caller (the screen), which also updates the
 * badge; this hook owns only the navigation.
 */
const toRouterData = (item: NotificationItem): NotificationDataType | null => {
  const actorId = item.actor?.id;
  const { videoId, commentId, chatId, position } = item.payload ?? {};

  switch (item.type) {
    case 'Message':
      if (!chatId || !actorId) {return null;}
      return { type: MessageType.Chat, chatId, userId: actorId };
    case 'Follow':
      if (!actorId) {return null;}
      return { type: MessageType.Follow, userId: actorId };
    case 'Like':
      if (!videoId) {return null;}
      return { type: MessageType.VideoLike, videoId };
    case 'Comment':
      if (!videoId || !commentId) {return null;}
      return { type: MessageType.VideoComment, videoId, commentId };
    case 'CommentLike':
      if (!videoId || !commentId) {return null;}
      return { type: MessageType.CommentLike, videoId, commentId };
    case 'VideoProcessed':
      if (!videoId) {return null;}
      return { type: MessageType.VideoProcessed, videoId };
    case 'Top100':
      if (!videoId) {return null;}
      return {
        type: MessageType.Top100,
        videoId,
        position: position != null ? String(position) : undefined,
      };
    default:
      return null;
  }
};

export const useNotificationPress = () => {
  return useCallback((item: NotificationItem) => {
    const data = toRouterData(item);
    // A row whose payload is missing the ids it needs (malformed or a target
    // that never had them) simply doesn't navigate rather than crashing.
    if (data) {
      routeNotification(data);
    }
  }, []);
};

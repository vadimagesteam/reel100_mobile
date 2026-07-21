import { navigationRef } from '../../navigation/navigationRef';
import { Screens } from '../../navigation/screens';
import { MessageType, NotificationDataType } from './notificationDataType';

/**
 * Single source of truth for where a notification leads, shared by push-tap
 * handling and the in-app notification center so the two can never drift.
 *
 * Every branch targets an existing screen; a target that no longer exists
 * (e.g. a deleted video) is handled by the destination screen's own
 * not-found state, so a dead target degrades to that screen rather than
 * crashing here.
 */
export const routeNotification = (data: NotificationDataType) => {
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

    // Comment and comment-like both land on the comment, not just the video.
    case MessageType.VideoComment:
    case MessageType.CommentLike:
      navigationRef.navigate(Screens.VideoModal, {
        videoId: data.videoId,
        commentId: data.commentId,
      });
      break;

    // A video like, a finished upload, and a Top 100 placement all open the
    // video itself — the most useful destination, and the id is in the payload.
    case MessageType.VideoLike:
    case MessageType.VideoProcessed:
    case MessageType.Top100:
      navigationRef.navigate(Screens.VideoModal, {
        videoId: data.videoId,
      });
      break;

    default:
      console.error('Unable to handle notification', data);
  }
};

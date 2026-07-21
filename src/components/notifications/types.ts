import { UserBase } from '../../state/user/types';

/**
 * Notification types, matching the backend PushNotificationType job names.
 * The comment-like type is the seventh, added with the comment-likes feature.
 */
export type NotificationType =
  | 'Like'
  | 'Comment'
  | 'CommentLike'
  | 'Follow'
  | 'VideoProcessed'
  | 'Message'
  | 'Top100';

/** Deep-link target fields; which are present depends on the type. */
export type NotificationPayload = {
  videoId?: string;
  commentId?: string;
  chatId?: string;
  position?: number;
} | null;

/** One row from GET /api/notifications — actor is joined in server-side. */
export type NotificationItem = {
  id: string;
  type: NotificationType;
  payload: NotificationPayload;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  actor: Pick<UserBase, 'id' | 'firstName' | 'lastName' | 'nickname' | 'avatar'> | null;
};

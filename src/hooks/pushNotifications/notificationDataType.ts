// Mirrors the backend PushNotificationMessageType discriminators. Kept in sync
// so push taps and in-app notification taps route through one shared handler.
export enum MessageType {
  Chat = 'chat',
  Follow = 'follow',
  VideoLike = 'video_like',
  VideoComment = 'video_comment',
  CommentLike = 'comment_like',
  VideoProcessed = 'video_processed',
  Top100 = 'top100',
  Tag = 'tag',
}

export type ChatMessage = {
  type: MessageType.Chat;
  chatId: string;
  userId: string; // from user id (interlocutor)
};

export type Follow = {
  type: MessageType.Follow;
  userId: string;
};

export type VideoLike = {
  type: MessageType.VideoLike;
  videoId: string;
};

export type VideoComment = {
  type: MessageType.VideoComment;
  videoId: string;
  commentId: string;
};

export type CommentLike = {
  type: MessageType.CommentLike;
  videoId: string;
  commentId: string;
};

export type VideoProcessed = {
  type: MessageType.VideoProcessed;
  videoId: string;
};

export type Top100 = {
  type: MessageType.Top100;
  videoId: string;
  position?: string;
};

/**
 * A shared hashtag page. `tags` arrives comma-separated because a deep link is
 * a flat string of query params — and it is a list, not one name, so a shared
 * "#oregon + #fishing" opens the intersection rather than one of its halves.
 */
export type TagLink = {
  type: MessageType.Tag;
  tags: string;
};

export type NotificationDataType =
  | ChatMessage
  | Follow
  | VideoLike
  | VideoComment
  | CommentLike
  | VideoProcessed
  | Top100
  | TagLink;

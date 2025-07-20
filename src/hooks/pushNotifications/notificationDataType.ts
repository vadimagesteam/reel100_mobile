export enum MessageType {
  Chat = 'chat',
  Follow = 'follow',
  VideoLike = 'video_like',
  VideoComment = 'video_comment',
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

export type NotificationDataType = ChatMessage | Follow | VideoLike | VideoComment;

import { useVideoFeed } from './useVideoFeed';

export const useVideoComments = () => {
  const commentText = useVideoFeed((s) => s.commentText);
  const commentReply = useVideoFeed((s) => s.commentReply);
  const commentsExpanded = useVideoFeed((s) => s.commentsExpanded);
  const {
    openComments,
    closeComments,
    setCommentReply,
    resetCommentReply,
    expandCommentReplies,
    toggleCommentReplies,
    setCommentText,
  } = useVideoFeed((s) => s.actions);

  return {
    text: commentText,
    commentReply,
    commentsExpanded,
    openComments,
    closeComments,
    setCommentReply,
    resetCommentReply,
    expandCommentReplies,
    toggleCommentReplies,
    setCommentText,
  };
};

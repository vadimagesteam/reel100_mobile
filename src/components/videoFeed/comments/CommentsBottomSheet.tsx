import React, { useMemo, useRef } from 'react';
import { CommentsList, CommentsListProps } from './CommentsList';
import { CommentReplyBar } from './CommentReplyBar';
import { CommentForm } from './CommentForm';
import { TextInput } from 'react-native-gesture-handler';
import { useCommentMutation } from './hooks/useCommentMutation';
import { useVideoComments, useVideoFeed } from '../hooks';
import { BottomSheet } from '../../ui';

export const CommentsBottomSheet = () => {
  const commentsOpened = useVideoFeed((s) => s.commentsOpened);
  const { closeComments: onClose } = useVideoFeed((s) => s.actions);
  const open = !!commentsOpened;
  const videoId = commentsOpened?.videoId;

  const snapPoints = useMemo(() => ['68%'], []);
  const addComment = useCommentMutation();
  const { commentReply, setCommentReply, resetCommentReply, expandCommentReplies } =
    useVideoComments();
  const textInputRef = useRef<TextInput | null>(null);

  const postComment = (commentText: string) => {
    textInputRef.current?.blur();
    // Expand reply section
    if (commentReply) {
      expandCommentReplies(commentReply.id);
      resetCommentReply();
    }
    addComment.mutate({
      replyTo: commentReply?.id,
      text: commentText,
      videoId: videoId!,
    });
  };

  const handleReply: CommentsListProps['onReply'] = (comment) => {
    setCommentReply(comment);
    textInputRef.current?.focus();
  };

  return (
    <BottomSheet open={open} onClose={onClose} snapPoints={snapPoints}>
      {videoId && (
        <>
          <CommentsList videoId={videoId} onReply={handleReply} />
          {commentReply && (
            <CommentReplyBar replyToUser={commentReply.user} onClose={resetCommentReply} />
          )}
          <CommentForm ref={textInputRef} onSubmit={postComment} />
        </>
      )}
    </BottomSheet>
  );
};

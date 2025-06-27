import { colors } from '../../../styles';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { CommentsList, CommentsListProps } from './CommentsList.tsx';
import { CommentReplyBar } from './CommentReplyBar.tsx';
import { CommentForm } from './CommentForm.tsx';
import { TextInput } from 'react-native-gesture-handler';
import { useCommentMutation } from './hooks/useCommentMutation.ts';
import { useVideoComments } from '../hooks';

export interface CommentsBottomSheetProps {
  open: boolean;
  onClose: () => void;
  videoId?: string;
}

export const CommentsBottomSheet = ({ open, onClose, videoId }: CommentsBottomSheetProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['68%'], []);

  const addComment = useCommentMutation();

  const { commentReply, setCommentReply, resetCommentReply, expandCommentReplies } =
    useVideoComments();

  useEffect(() => {
    if (open) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [open]);

  const handleSheetChange = useCallback(
    (index: number) => {
      // Close action
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

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
    <BottomSheet
      index={-1}
      backgroundStyle={styles.backgroundStyle}
      style={styles.bottomSheetStyle}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enableDynamicSizing={false}
      enablePanDownToClose
      keyboardBehavior="extend"
    >
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

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: colors.black4,
  },
  bottomSheetStyle: { backgroundColor: colors.black4 },
  handleIndicatorStyle: {
    backgroundColor: colors.white1,
  },
});

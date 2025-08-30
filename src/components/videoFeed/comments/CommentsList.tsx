import { toast } from '@backpackapp-io/react-native-toast';
import React, { useCallback, useMemo, useRef } from 'react';
import { ActivityIndicator, ListRenderItem, Text, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { FlexLoading } from '../../ui';
import { CommentType, useCommentsInfiniteQuery } from './hooks/useCommentsInfiniteQuery';
import { CommentsListItem } from './CommentsListItem';
import { useCommentMutation } from './hooks/useDeleteCommentMutation';
import { useScrollToNewComment } from './hooks/useScrollToNewComment';
import { useVideoComments } from '../hooks';

export interface CommentsListProps {
  videoId: string;
  // should be memoized for better performance
  onReply?: (comment: CommentType) => void;
  // should be memoized for better performance
  // should be used with normalized api...currently we don't use it
  onLoadReplies?: (comment: CommentType) => void;
}

export const CommentsList = ({ videoId, onReply }: CommentsListProps) => {
  const { flatPages, data, isFetchingNextPage, isLoading, hasNextPage, fetchNextPage } =
    useCommentsInfiniteQuery(videoId);

  const { commentsExpanded, toggleCommentReplies } = useVideoComments();
  const { mutateAsync: deleteComment } = useCommentMutation();

  const itemHeighByIndex = useRef<Record<number, number>>({});

  const listRef = useRef<BottomSheetFlatListMethods>(null);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const commentsTree = useMemo(() => {
    return flatPages
      .filter((c) => !c.replyTo)
      .reduce((acc, comment) => {
        const replies = flatPages
          .filter((r) => r.replyTo === comment.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return [
          ...acc,
          { ...comment, repliesCount: replies.length },
          ...(commentsExpanded.includes(comment.id) ? replies : []),
        ];
      }, [] as CommentType[]);
  }, [flatPages, commentsExpanded]);

  console.log('video id', videoId);

  const renderComment = useCallback<ListRenderItem<CommentType>>(
    ({ item, index }) => {
      return (
        <CommentsListItem
          onLayout={(e) => {
            itemHeighByIndex.current[index] = e.nativeEvent.layout.height;
          }}
          comment={item}
          onDelete={async (c) => {
            await deleteComment({ id: c.id, videoId: c.video.id });
            toast.success('Comment deleted');
          }}
          onReplyPress={onReply}
          onToggleReplies={(c) => toggleCommentReplies(c.id)}
        />
      );
    },
    [onReply, deleteComment, toggleCommentReplies],
  );

  useScrollToNewComment(listRef, flatPages, commentsTree);

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <BottomSheetFlatList
      ref={listRef}
      data={commentsTree}
      contentContainerClassName="p-4"
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={
        <View className="min-h-[280px] flex-1 items-center justify-center">
          <Text className="text-xl text-neutral-400">No comments yet</Text>
        </View>
      }
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator className="my-4" color="#aaa" /> : null
      }
    />
  );
};

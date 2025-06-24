import React, { useCallback, useMemo, useRef } from 'react';
import { ActivityIndicator, ListRenderItem, Text, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { CommentType, useCommentsInfiniteQuery } from './queries/useCommentsInfiniteQuery.ts';
import { CommentsListItem } from './CommentsListItem.tsx';
import {
  useVideoActions,
  useVideoPlayerStore,
} from '../../../state/videoPlayer/videoVideoPlayerStore.ts';
import { useScrollToNewComment } from './hooks/useScrollToNewComment.ts';

export interface CommentsListProps {
  videoId: string;
  // should be memoized for better performance
  onReply?: (comment: CommentType) => void;
  // should be memoized for better performance
  // should be used with normalized api...currently we don't use it
  onLoadReplies?: (comment: CommentType) => void;
}

export const CommentsList = ({ videoId, onReply }: CommentsListProps) => {
  const { flatPages, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCommentsInfiniteQuery(videoId);

  const commentsExpanded = useVideoPlayerStore((s) => s.commentsExpanded);
  const { toggleCommentReplies } = useVideoActions();

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

  const renderComment = useCallback<ListRenderItem<CommentType>>(
    ({ item, index }) => {
      return (
        <CommentsListItem
          onLayout={(e) => {
            itemHeighByIndex.current[index] = e.nativeEvent.layout.height;
          }}
          comment={item}
          onReplyPress={onReply}
          onToggleReplies={(c) => toggleCommentReplies(c.id)}
        />
      );
    },
    [toggleCommentReplies, onReply],
  );

  useScrollToNewComment(listRef, flatPages, commentsTree);

  return (
    <BottomSheetFlatList
      ref={listRef}
      data={commentsTree}
      contentContainerClassName="p-4"
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={() => (
        <View className="min-h-[280px] flex-1 items-center justify-center">
          <Text className="text-xl text-neutral-400">No comments yet</Text>
        </View>
      )}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator className="my-4" color="#aaa" /> : null
      }
    />
  );
};

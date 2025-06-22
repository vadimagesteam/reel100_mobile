import React from 'react';
import { Image, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { CommentType } from './queries/useCommentsInfiniteQuery.ts';
import { formatTimeAgo } from '../../../utils/formatTime.ts';

export interface CommentListItemProps<T = CommentType> extends Pick<ViewProps, 'onLayout'> {
  comment: T;
  onReplyPress?: (comment: T) => void;
  onToggleReplies?: (comment: T) => void;
}

export const CommentsListItem = ({
  comment: item,
  onReplyPress,
  onToggleReplies,
  onLayout,
}: CommentListItemProps) => {
  return (
    <View
      className="mt-[10px]"
      style={{
        marginLeft: item.replyTo ? 20 : 0,
      }}
      onLayout={onLayout}
    >
      <View className="flex-row justify-between rounded-[10] bg-black1 p-[10px]">
        <View>
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png' }}
              className="h-[30px] w-[30px]"
            />
            <Text className="ml-[5px] text-[16px] font-bold text-silver4">
              {`${item?.user?.firstName} ${item?.user?.lastName}`}
            </Text>
          </View>
          <View className="ml-[36px]">
            <Text className="text-silver1">{item?.text}</Text>
          </View>
        </View>
        <Text className="text-[9px] text-white">
          {item.id.startsWith('optimistic') ? 'sending...' : formatTimeAgo(item?.createdAt)}
        </Text>
      </View>

      {!item.replyTo && (
        <View className="flex-row items-center justify-between">
          <TouchableOpacity hitSlop={20} onPress={() => onReplyPress?.(item)}>
            <Text className="text-white">Reply</Text>
          </TouchableOpacity>
          {item.repliesCount > 0 && (
            <TouchableOpacity
              hitSlop={20}
              onPress={() => onToggleReplies?.(item)}
              className="flex-row items-center"
            >
              <Text className="ml-1 mt-1 text-silver4">view {item.repliesCount} replies</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

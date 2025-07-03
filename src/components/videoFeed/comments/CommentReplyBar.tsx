import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CommentType } from './hooks/useCommentsInfiniteQuery.ts';

export interface CommentReplyBarProps {
  replyToUser: CommentType['user'];
  onClose: () => void;
}

export const CommentReplyBar = ({
  replyToUser: { firstName, lastName },
  onClose,
}: CommentReplyBarProps) => (
  <View className="flex-row items-center justify-between bg-black1 p-[10px]">
    <Text className="text-silver4">Replying to {`${firstName} ${lastName}`}</Text>
    <TouchableOpacity hitSlop={20} onPress={onClose}>
      <Text className="ml-2.5 text-white">✕ Cancel</Text>
    </TouchableOpacity>
  </View>
);

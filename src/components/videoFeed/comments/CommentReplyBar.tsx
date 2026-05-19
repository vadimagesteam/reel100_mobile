import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getDisplayName } from '../../../state/user/utils';
import { CommentType } from './hooks/useCommentsInfiniteQuery';

export interface CommentReplyBarProps {
  replyToUser: CommentType['user'];
  onClose: () => void;
}

export const CommentReplyBar = ({ replyToUser, onClose }: CommentReplyBarProps) => (
  <View className="flex-row items-center justify-between bg-surface p-[10px]">
    <Text className="text-silver4">Replying to {getDisplayName(replyToUser)}</Text>
    <TouchableOpacity hitSlop={20} onPress={onClose}>
      <Text className="ml-2.5 text-primary">✕ Cancel</Text>
    </TouchableOpacity>
  </View>
);

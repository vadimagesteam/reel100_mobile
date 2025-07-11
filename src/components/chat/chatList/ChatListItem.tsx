import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { UserBase } from '../../../state/user/types';
import { getFullName } from '../../../state/user/utils';
import { formatTime } from '../../../utils';
import { Avatar } from '../../ui';
import { MessageStatusIcon } from '../dialog/MessageStatusIcon';
import { ChatType } from '../hooks/useChats';

export interface ChatListItemProps {
  user: UserBase;
  onPress?: () => void;
  item: ChatType;
}

export const ChatListItem = ({ item, user, onPress }: ChatListItemProps) => (
  <TouchableOpacity className="flex-row border-b border-zinc-600 px-4 py-3" onPress={onPress}>
    <Avatar size={50} uri={user.avatar} name={getFullName(user)} />
    <View className="ml-3 flex-1 justify-center">
      <View className="flex-row items-center justify-between">
        <Text className="text-[16px] font-bold text-primary">{getFullName(user)}</Text>
        {item.lastMessage && (
          <View className="flex-row gap-1">
            <MessageStatusIcon sent read={item.lastMessage.isRead} />
            <Text className="text-xs text-zinc-400">{formatTime(item.lastMessage?.createdAt)}</Text>
          </View>
        )}
      </View>
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="flex-1 text-sm text-zinc-400" numberOfLines={1}>
          {item.lastMessage?.text}
        </Text>
        {item.unreadMessagesCount ? (
          <View className="ml-2 rounded-full bg-[#2e89ff] px-2 py-0.5">
            <Text className="text-xs text-primary">{item.unreadMessagesCount}</Text>
          </View>
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);

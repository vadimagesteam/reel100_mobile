import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFullName } from '../../../state/user/utils';
import { Avatar } from '../../ui';
import { ChatPreview } from './types';
import { mockChatList } from './mockData';
import { Screens } from '../../../navigation/screens';

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatListScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      className="flex-row border-b border-zinc-600 px-4 py-3"
      onPress={() =>
        navigation.navigate(Screens.Chat, {
          firstName: item?.firstName,
          lastName: item?.lastName,
        })
      }
    >
      <Avatar size={50} name={getFullName(item)} />
      <View className="ml-3 flex-1 justify-center">
        <View className="flex-row items-center justify-between">
          <Text className="text-[16px] font-bold text-white">
            {`${item.firstName} ${item?.lastName}`}
          </Text>
          <Text className="text-xs text-zinc-400">{formatTime(item.timestamp)}</Text>
        </View>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="flex-1 text-sm text-zinc-400" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount ? (
            <View className="ml-2 rounded-full bg-[#2e89ff] px-2 py-0.5">
              <Text className="text-xs text-white">{item.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
  return <FlatList data={mockChatList} renderItem={renderItem} keyExtractor={(item) => item.id} />;
};

export default ChatListScreen;

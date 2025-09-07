import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useLoadingCallback } from '../../../hooks/useLoadingCallback';
import { useNavigation } from '../../../navigation';
import { useUser } from '../../../state/user/authStore';
import { FlexLoading, ListEmptyBlock } from '../../ui';
import { ChatType, useChats } from '../hooks/useChats';
import { ChatListItem } from './ChatListItem';
import { Screens } from '../../../navigation/screens';

const getInterlocutorUser = (myId: string, { user1, user2 }: ChatType) =>
  user1.id === myId ? user2 : user1;

export const ChatList = () => {
  const me = useUser();
  const navigation = useNavigation();
  const { data, isLoading, refetch } = useChats();

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  const openChat = useCallback(
    (chat: ChatType) => {
      navigation.navigate(Screens.Chat, {
        chatId: chat.id,
        userId: getInterlocutorUser(me.id, chat).id,
      });
    },
    [navigation, me],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatType }) => {
      const chatUser = getInterlocutorUser(me.id, item);
      return (
        <ChatListItem
          user={chatUser}
          item={item}
          onPress={() => {
            openChat(item);
          }}
        />
      );
    },
    [me, openChat],
  );

  if (!data && isLoading) {
    return <FlexLoading />;
  }

  return (
    <FlatList
      data={data}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={['#fff']}
          tintColor="#fff"
        />
      }
      ListEmptyComponent={
        <ListEmptyBlock title="No Chats" message="You are not received any messages yet" />
      }
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

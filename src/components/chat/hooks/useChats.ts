import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';
import { UserBase } from '../../../state/user/types';
import { ChatMessageType } from './useChatMessages';

export type ChatType = {
  id: string;
  unreadMessagesCount: number;
  createdAt: number;
  updatedAt: number;
  user1: UserBase;
  user2: UserBase;
  lastMessage?: ChatMessageType;
};

export type ChatApiResponseType = Omit<ChatType, 'unreadMessagesCount'> & {
  unreadMessagesCount1: number;
  unreadMessagesCount2: number;
};

const gqlChatsQuery = `query {
    chats {
        id
        user1 { id firstName lastName avatar }
        user2 { id firstName lastName avatar }
        createdAt
        unreadMessagesCount1
        unreadMessagesCount2
        lastMessage {
            id
            text
            createdAt
            fromField { id firstName }
            to { id firstName }
            isRead
        }
        updatedAt        
    }
}`;

export const useChats = () => {
  const user = useUser();
  const cacheKey = useMemo(() => ['chats', user.id], [user.id]);
  return useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      console.log('Query chats');
      const { data } = await api.post<{
        data: { chats: ChatApiResponseType[] };
      }>('/graphql', {
        operationName: null,
        query: gqlChatsQuery,
        variables: {},
      });

      if (data.data?.chats) {
        return data.data?.chats.map<ChatType>((chat) => ({
          ...chat,
          unreadMessagesCount:
            chat.user1.id === user.id ? chat.unreadMessagesCount1 : chat.unreadMessagesCount2,
        }));
      }

      return [];
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchInterval: 2000,
  });
};

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UserBase } from '../../../state/user/types';

export type SingleChat = {
  id: string;
  user1: UserBase;
  user2: UserBase;
};

const gqlChatsQuery = `query($chatId: String!) {
    chat(
      where: {
        id: $chatId
      }
    ) {
        id
        user1 { id firstName lastName avatar }
        user2 { id firstName lastName avatar }        
    }
}`;

export const useChat = (chatId: string) => {
  const cacheKey = ['chats', chatId];
  return useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      const { data } = await api.post<{
        data: { chat: SingleChat };
      }>('/graphql', {
        operationName: null,
        query: gqlChatsQuery,
        variables: {
          chatId,
        },
      });
      return data.data.chat;
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

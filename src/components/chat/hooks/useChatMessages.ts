import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UserBase } from '../../../state/user/types';
import { VideoPost } from '../../videoFeed/queries/apiVideosFetcher';

export type ChatMessageType = {
  id: string;
  fromField: UserBase;
  to: UserBase;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  text: string;
  video?: VideoPost;
};

const qqlQuery = `query(
 $chatId: String!
) {
    messages(
       where: {
         chat: { id: $chatId }
       }
       orderBy: {
        createdAt: Desc
       }
    ) {
        id
        chat { id }
        fromField { ...ShallowUser }
        to { ...ShallowUser }
        video {
            id
            likesCount
            commentsCount
            description
            file
            user { ...ShallowUser }
        }
        text
        isRead
        createdAt
        updatedAt
    }
}
fragment ShallowUser on User { id firstName lastName avatar }
`;

export const useChatMessages = (chatId?: string) => {
  const cacheKey = ['chat_messages', chatId];

  return useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      const {
        data: { data },
      } = await api.post<{
        data: {
          messages: ChatMessageType[];
        };
      }>('/graphql', {
        query: qqlQuery,
        variables: {
          chatId,
        },
      });
      return data.messages;
    },
    enabled: !!chatId,
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchInterval: 1000,
  });
};

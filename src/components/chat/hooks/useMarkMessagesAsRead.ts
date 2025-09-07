import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { ChatMessageType } from './useChatMessages';

export type MarkMessagesAsReadArgs = {
  chatId: string;
  messageIds: string[];
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageIds }: MarkMessagesAsReadArgs) => {
      const payload = { isRead: true };
      return Promise.all(
        messageIds.map(async (msgId) => {
          const { data } = await api.patch<ChatMessageType>(`/api/messages/${msgId}`, payload);
          return data;
        }),
      );
    },
    onMutate: async ({ chatId, messageIds }) => {
      if (!chatId) {
        return;
      }
      await queryClient.cancelQueries({ queryKey: ['chat_messages', chatId] });
      const prevMessages =
        queryClient.getQueryData<ChatMessageType[]>(['chat_messages', chatId]) ?? [];
      queryClient.setQueryData(
        ['chat_messages', chatId],
        prevMessages.map((msg) => {
          return messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg;
        }),
      );
      return { chatId, prevMessages };
    },
    onError: (_err, _vars, context) => {
      if (context?.chatId) {
        queryClient.setQueryData(['chat_messages', context.chatId], context.prevMessages);
      }
    },
    onSettled: (_data, _err, { chatId }) => {
      if (chatId) {
        queryClient.invalidateQueries({ queryKey: ['chat_messages', chatId] });
      }
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';

export type SendMessageArgs = {
  chatId?: string;
  toUserId: string;
  text: string;
  videoId?: string;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async ({ toUserId, text, videoId }: SendMessageArgs) => {
      const payload = {
        fromField: { id: user.id },
        to: { id: toUserId },
        text,
        ...(videoId ? { video: { id: videoId } } : {}),
      };
      const { data } = await api.post('/api/messages', payload);
      return data;
    },
    onMutate: async ({ chatId, text }) => {
      if (!chatId) return;

      const tmpId = `tmp-${Math.random().toString(36).padStart(2, '0')}`;
      const now = new Date().toISOString();

      const newMessage = {
        id: tmpId,
        fromField: user,
        createdAt: now,
        updatedAt: now,
        pending: true,
        sent: false,
        text,
      };

      await queryClient.cancelQueries({ queryKey: ['chat_messages', chatId] });

      const prevMessages = queryClient.getQueryData<any[]>(['chat_messages', chatId]) ?? [];

      queryClient.setQueryData(['chat_messages', chatId], [newMessage, ...prevMessages]);

      return { chatId, prevMessages, tmpId };
    },
    onError: (_err, _vars, context) => {
      if (context?.chatId) {
        queryClient.setQueryData(['chat_messages', context.chatId], context.prevMessages);
      }
    },
    onSuccess: (realMessage, { chatId }, context) => {
      if (!chatId || !context?.tmpId) return;

      queryClient.setQueryData(['chat_messages', chatId], (old: any = []) =>
        old.map((msg: any) => (msg.id === context.tmpId ? realMessage : msg)),
      );
    },
    onSettled: (_data, _err, { chatId }) => {
      if (chatId) {
        queryClient.invalidateQueries({ queryKey: ['chat_messages', chatId] });
      }
    },
  });
};

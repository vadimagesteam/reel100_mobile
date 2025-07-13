import { useMemo } from 'react';
import { useChats } from './useChats';

export const useUnreadChatsCount = (): number => {
  const { data: chats } = useChats();

  return useMemo(
    () =>
      (chats ?? []).reduce((acc, chat) => {
        return acc + (chat.unreadMessagesCount ? 1 : 0);
      }, 0),
    [chats],
  );
};

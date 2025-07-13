import { useCallback } from 'react';
import { useNavigation } from '../../../navigation';
import { Screens } from '../../../navigation/screens';
import { useUser } from '../../../state/user/authStore';
import { useChats } from './useChats';

export const useChatNavigation = () => {
  const { data, isLoading } = useChats();
  const user = useUser();
  const navigation = useNavigation();

  return useCallback(
    (userId: string) => {
      if (data && !isLoading) {
        // find chat between authenticated user & target user id
        const chat = data.find(
          ({ user1, user2 }) =>
            (user1.id === user.id && user2.id === userId) ||
            (user1.id === userId && user2.id === user.id),
        );
        navigation.navigate(Screens.Chat, {
          chatId: chat?.id,
          userId,
        });
      }
    },
    [data, isLoading, navigation, user.id],
  );
};

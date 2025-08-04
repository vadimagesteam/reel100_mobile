import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';
import { blockingApi } from '../queries/blockingApi';

type BlockedUser = { id: string };

export const useUserBlocking = (userId: string) => {
  const queryClient = useQueryClient();
  const user = useUser();

  const queryKey = ['user', 'blockedUsers', userId];

  const block = useMutation({
    mutationFn: () => blockingApi.blockUser(user.id, userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData<BlockedUser | null>(queryKey);

      queryClient.setQueryData(queryKey, {
        id: `optimistic_${Math.random().toString(32).slice(2)}`,
      });

      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 2) });
    },
    retry: 3,
  });

  const blockedUserQuery = useQuery({
    queryKey,
    queryFn: () => blockingApi.findUserBlock(userId),
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const unblock = useMutation({
    mutationFn: () => blockingApi.unblockUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData<BlockedUser | null>(queryKey);

      queryClient.setQueryData(queryKey, null);

      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 2) });
    },
    retry: 3,
  });

  return { block, unblock, blockedUserQuery };
};

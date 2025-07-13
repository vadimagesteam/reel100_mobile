import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';
import { RelationId, UserType } from '../../../state/user/types';

type FollowArgs = {
  userId: string;
  followId: RelationId;
};

export const useUnFollowMutation = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async ({ followId }: FollowArgs) => {
      const { data } = await api.delete(`/api/follows/${followId}`);
      return data;
    },
    onMutate: async ({ userId }) => {
      const key = ['user', userId];
      await queryClient.cancelQueries({ queryKey: key });

      const prev = queryClient.getQueryData<UserType>(key);

      if (!prev) {
        return { key, prev };
      }

      const updated = {
        ...prev,
        whoms: (prev.whoms || []).filter((whom) => whom.who.id !== user.id),
      };

      queryClient.setQueryData(key, updated);
      return { key, prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev && context?.key) {
        queryClient.setQueryData(context.key, context.prev);
      }
    },
    onSettled: async (_data, _error, { userId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user', userId] }),
        queryClient.refetchQueries({ type: 'all', exact: true, queryKey: ['user', userId] }),
      ]);
    },
    retry: 3,
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';
import { extractUserBase } from '../../../state/user/utils';

type FollowArgs = {
  userId: string;
};

export const useFollowMutation = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async ({ userId }: FollowArgs) => {
      const { data } = await api.post('/api/follows', {
        who: { id: user.id },
        whom: { id: userId },
      });
      return data;
    },
    onMutate: async ({ userId }) => {
      const key = ['user_', userId];
      await queryClient.cancelQueries({ queryKey: key });

      const prev = queryClient.getQueryData<any>(key);

      if (!prev) {
        return { key, prev };
      }

      const updated = {
        ...prev,
        whoms: [
          ...(prev.whoms || []),
          {
            id: `optimistic_${Math.random() * 100000}`,
            who: extractUserBase(user),
          },
        ],
      };

      queryClient.setQueryData(key, updated);
      return { key, prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev && context?.key) {
        queryClient.setQueryData(context.key, context.prev);
      }
    },
    onSettled: (_data, _error, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user_', userId] });
    },
    retry: 3,
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api.ts';
import { useUser } from '../../../state/user/authStore.ts';

type FollowArgs = {
  user_id: string;
};

export const useFollowMutation = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: async ({ user_id }: FollowArgs) => {
      const { data } = await api.post('/api/follows', {
        who: { id: user.id },
        whom: { id: user_id },
      });
      console.log('->>> follow mutation response', data);
      return data;
    },
    onMutate: async ({ user_id }) => {
      const key = ['user_', user_id];
      await queryClient.cancelQueries({ queryKey: key });

      const prev = queryClient.getQueryData<any>(key);

      if (!prev) {
        return { key, prev };
      }

      const updated = {
        ...prev,
        whoms: [...(prev.whoms || []), { id: user.id }],
      };

      queryClient.setQueryData(key, updated);
      return { key, prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev && context?.key) {
        queryClient.setQueryData(context.key, context.prev);
      }
    },
    onSettled: (_data, _error, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ['user_', user_id] });
    },
    retry: 3,
  });
};

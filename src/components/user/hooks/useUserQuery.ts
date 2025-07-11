import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UserType } from '../../../state/user/types';

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user_', userId],
    queryFn: async () => {
      const resp = await api.get<UserType>(`/api/users/${userId}`);
      return resp.data;
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

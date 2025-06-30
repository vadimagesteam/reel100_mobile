import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api.ts';
import { UserType } from '../../../state/user/types.ts';
import { useEffect } from 'react';

export const useUserQuery = (userId: string) => {
  const queryResult = useQuery({
    queryKey: ['user_', userId],
    queryFn: async () => {
      const resp = await api.get<UserType>(`/api/users/${userId}`);
      return resp.data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { refetch } = queryResult;

  useEffect(() => {
    refetch();
  }, [refetch]);

  return queryResult;
};

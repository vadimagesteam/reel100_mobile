import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { UserType } from '../../../../state/user/types';

export const useShareablePeopleQuery = (searchQuery?: string) => {
  const hasSearchRequest = !!searchQuery?.trim().length;
  return useQuery({
    queryKey: hasSearchRequest ? ['shareable_people'] : ['shareable_people_search'],
    queryFn: async () => {
      const resp = await api.get<UserType[]>('/api/users', {
        params: {
          ...(hasSearchRequest
            ? {
                'where[firstName][startsWith]': searchQuery!.trim(),
              }
            : {}),
          take: 20,
        },
      });
      return resp.data;
    },
    refetchOnMount: 'always',
    staleTime: hasSearchRequest ? 0 : Infinity,
    gcTime: hasSearchRequest ? 0 : 1000 * 60 * 60 * 24,
  });
};

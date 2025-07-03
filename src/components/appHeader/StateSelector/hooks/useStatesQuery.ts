import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../lib/api.ts';
import { StateItem } from '../../../../state/app/uiStore.ts';

export const useStatesQuery = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const resp = await api.get<StateItem[]>('/api/states');
      return resp.data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { StateRankingItem, StateRankingSort } from '../types';

/**
 * All states for the state-search screen, each enriched with upload counts
 * (today + last 7 days). Backed by GET /api/search/states. The endpoint returns
 * every state, so a single fetch powers both the "Most Active" and "A-Z" tabs
 * (the latter is derived client-side). The backend recomputes counts event-
 * driven (a few seconds after any upload/like) plus a daily safety refresh, and
 * publishing a video invalidates the ['search'] queries — so this only needs a
 * short staleTime to pick up other users' uploads on a revisit.
 */
export const useStateRankingQuery = (sort: StateRankingSort = 'most_active') => {
  return useQuery({
    queryKey: ['search', 'states', sort],
    queryFn: async () => {
      const { data } = await api.get<StateRankingItem[]>('/api/search/states', {
        params: { sort },
      });
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 min — counts move with every upload/like
    gcTime: 1000 * 60 * 60 * 24,
  });
};

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { SearchRecommendationsResponse } from '../types';

/**
 * Top 3 users + top 3 states by 7-day activity, shown when the search bar is
 * focused without a typed query (and as the 4U feed empty state). The backend
 * recomputes these event-driven (a few seconds after any upload/like) plus a
 * daily safety refresh, and publishing a video invalidates the ['search']
 * queries — so a short staleTime is enough to pick up fresh numbers on revisit,
 * matching the state ranking.
 */
export const useSearchRecommendationsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['search', 'recommendations'],
    enabled: options?.enabled,
    queryFn: async () => {
      const { data } = await api.get<SearchRecommendationsResponse>(
        '/api/search/recommendations',
      );
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 min — recomputed event-driven after upload/like
    gcTime: 1000 * 60 * 60 * 24,
  });
};

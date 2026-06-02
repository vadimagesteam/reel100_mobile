import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { SearchRecommendationsResponse } from '../types';

/**
 * Top 3 users + top 3 states by 7-day activity, shown when the search bar is
 * focused without a typed query (and as the 4U feed empty state). The backend
 * recomputes these hourly, so a long staleTime is fine.
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
    staleTime: 1000 * 60 * 30, // 30 min — backend refreshes hourly
    gcTime: 1000 * 60 * 60 * 24,
  });
};

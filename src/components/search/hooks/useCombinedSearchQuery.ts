import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { CombinedSearchResult } from '../types';

/**
 * Combined, alphabetically-sorted users + states for a typed query.
 * Backed by GET /api/search?q=. Results are kept while the next query loads so
 * the list doesn't flash empty between keystrokes.
 */
export const useCombinedSearchQuery = (query: string, options?: { enabled?: boolean }) => {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['search', 'combined', trimmed],
    enabled: (options?.enabled ?? true) && trimmed.length > 0,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<CombinedSearchResult[]>('/api/search', {
        params: { q: trimmed, take: 50 },
      });
      return data;
    },
    staleTime: 1000 * 60, // 1 min
    gcTime: 1000 * 60 * 60,
  });
};

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { SearchSectionsResponse } from '../types';

/** Rows previewed per section before "View all" takes over. */
export const SECTION_PREVIEW_SIZE = 3;

/**
 * The whole results screen in one request: creators, states, hashtags and
 * videos, each with a preview and whether more sits behind its "View all".
 *
 * Backed by GET /api/search/sections. Previous results are kept while the next
 * query loads, so the sections don't collapse and reflow between keystrokes.
 */
export const useSearchSectionsQuery = (
  query: string,
  options?: { enabled?: boolean },
) => {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['search', 'sections', trimmed],
    enabled: (options?.enabled ?? true) && trimmed.length > 0,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<SearchSectionsResponse>('/api/search/sections', {
        params: { q: trimmed, take: SECTION_PREVIEW_SIZE },
      });
      return data;
    },
    staleTime: 1000 * 60, // 1 min
    gcTime: 1000 * 60 * 60,
  });
};

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '../../../lib/api';
import {
  CombinedSearchResult,
  SearchSectionPageResponse,
  SearchSectionType,
} from '../types';

const PAGE_SIZE = 20;

/**
 * Where the next page starts: everything already loaded.
 *
 * Paging stops on the section's own hasMore rather than on a short page. The
 * backend already answers that question, and a short page is not the end of a
 * list — treating it as one would cut a section off early, while ignoring
 * hasMore would fetch a wasted empty page at the end of every section.
 */
export const nextSectionPageParam = (
  lastPage: Pick<SearchSectionPageResponse, 'hasMore' | 'items'>,
  allPages: Pick<SearchSectionPageResponse, 'items'>[],
): number | undefined =>
  lastPage.hasMore ? allPages.reduce((n, p) => n + p.items.length, 0) : undefined;

/**
 * One section, paged — what "View all" scrolls through.
 *
 * Backed by GET /api/search/section, which applies the same matching and
 * ranking the preview used. A full list that re-ranked would not be the list
 * the user tapped into.
 */
export const useSearchSectionQuery = (query: string, type: SearchSectionType) => {
  const trimmed = query.trim();

  const result = useInfiniteQuery({
    queryKey: ['search', 'section', type, trimmed],
    enabled: trimmed.length > 0,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<SearchSectionPageResponse>('/api/search/section', {
        params: { q: trimmed, type, skip: pageParam, take: PAGE_SIZE },
      });
      return data;
    },
    getNextPageParam: nextSectionPageParam,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60,
  });

  const items = useMemo<CombinedSearchResult[]>(
    () => result.data?.pages.flatMap((p) => p.items) ?? [],
    [result.data],
  );

  return { ...result, items };
};

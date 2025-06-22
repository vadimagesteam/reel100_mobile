import { useInfiniteQuery } from '@tanstack/react-query';
import { apiVideosFetcher } from './apiVideosFetcher.ts';
import { useEffect, useMemo } from 'react';
import { queryClient } from '../../../lib/api.ts';

export type usePostsInfiniteQueryParams = {
  limit?: number;
  cacheKey?: string;
};

export const usePostsInfiniteQuery = (params: usePostsInfiniteQueryParams) => {
  const { limit = 10, cacheKey } = params;
  const hookResult = useInfiniteQuery({
    queryKey: [cacheKey],
    queryFn: async ({ pageParam = 0 }) => {
      return apiVideosFetcher({ take: limit, skip: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flat().length;
      return lastPage.length === limit ? totalLoaded : undefined;
    },
    initialPageParam: 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { refetch } = hookResult;

  // Refetch manually only first page
  useEffect(() => {
    queryClient.setQueryData<{ pages: any[]; pageParams: any[] }>([cacheKey], (data) => {
      if (data) {
        return {
          pages: (data?.pages as any[]).slice(0, 1),
          pageParams: (data?.pageParams as any[]).slice(0, 1),
        };
      }
    });
    refetch();
  }, [refetch, cacheKey]);

  const flatPages = useMemo(() => hookResult.data?.pages.flat() ?? [], [hookResult.data?.pages]);

  return {
    ...hookResult,
    flatPages,
  };
};

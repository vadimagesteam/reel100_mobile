import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { apiVideosFetcher, VideoPost } from '../queries/apiVideosFetcher';
import { useEffect, useMemo } from 'react';
import { queryClient } from '../../../lib/api';

export type usePostsInfiniteQueryParams = {
  limit?: number;
  cacheKey: string[];
  where?: Record<string, string | number>;
  orderBy?: Record<string, string>;
  refetchInterval?: number | false;
};

export type VideoPostQueryResult<T extends VideoPost = VideoPost> = UseInfiniteQueryResult<
  InfiniteData<T[]>
> & {
  flatPages: T[];
};

export const useVideosInfiniteQuery = <T extends VideoPost = VideoPost>(
  params: usePostsInfiniteQueryParams,
): VideoPostQueryResult<T> => {
  const { limit = 20, cacheKey, where, orderBy, refetchInterval } = params;
  const hookResult = useInfiniteQuery({
    queryKey: cacheKey,
    queryFn: async ({ pageParam = 0 }) => {
      return apiVideosFetcher({ take: limit, skip: pageParam, where, orderBy });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flat().length;
      return lastPage.length === limit ? totalLoaded : undefined;
    },
    initialPageParam: 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchInterval,
  });

  const { refetch } = hookResult;

  // Refetch manually only first page
  useEffect(() => {
    queryClient.setQueryData<{ pages: any[]; pageParams: any[] }>(cacheKey, (data) => {
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
  } as VideoPostQueryResult<T>;
};

import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { CacheKey } from '../provider/videoFeedStore';
import { apiVideosFetcher, ApiVideosFetcherParams, VideoPost } from '../queries/apiVideosFetcher';
import { useEffect, useMemo } from 'react';
import { queryClient } from '../../../lib/api';

/**
 * Cache key of the personalized 4U feed. Lives here rather than in the screen
 * because the like mutations have to reach it: a like changes the tag
 * affinities the server ranks that feed by, which makes the cached pages
 * stale.
 */
export const FOR_YOU_CACHE_KEY = ['for_you_videos'];

export type usePostsInfiniteQueryParams = {
  limit?: number;
  cacheKey: CacheKey;
  refetchInterval?: number | false;
  /**
   * On mount, drop every loaded page but the first and refetch it, so a feed
   * screen reopens with fresh data instead of a long stale scrollback.
   * Defaults to true.
   *
   * The video-feed modal opens on top of a grid that shares this exact
   * cacheKey and has already loaded the page holding the tapped video. It must
   * pass false — otherwise this truncation removes that page from the shared
   * cache the instant the modal mounts, so deep-linking to a video beyond the
   * first page lands on nothing.
   */
  refetchFirstPageOnMount?: boolean;
} & Omit<ApiVideosFetcherParams, 'skip' | 'take'>;

export type VideoPostQueryResult<T extends VideoPost = VideoPost> = UseInfiniteQueryResult<
  InfiniteData<T[]>
> & {
  flatPages: T[];
  queryParams: usePostsInfiniteQueryParams;
};

export const useVideosInfiniteQuery = <T extends VideoPost = VideoPost>(
  params: usePostsInfiniteQueryParams,
): VideoPostQueryResult<T> => {
  const {
    limit = 20,
    cacheKey,
    where,
    orderBy,
    refetchInterval,
    refetchFirstPageOnMount = true,
  } = params;
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
    if (!refetchFirstPageOnMount) {
      return;
    }
    queryClient.setQueryData<{ pages: any[]; pageParams: any[] }>(cacheKey, (data) => {
      if (data) {
        return {
          pages: (data?.pages as any[]).slice(0, 1),
          pageParams: (data?.pageParams as any[]).slice(0, 1),
        };
      }
    });
    refetch();
  }, [refetch, cacheKey, refetchFirstPageOnMount]);

  const flatPages = useMemo(() => hookResult.data?.pages.flat() ?? [], [hookResult.data?.pages]);

  return {
    ...hookResult,
    flatPages,
    queryParams: params,
  } as VideoPostQueryResult<T>;
};

export const updateVideoCache = (
  cacheKey: CacheKey,
  videoId: string,
  updateFn: (video: VideoPost) => VideoPost,
) => {
  const prev = queryClient.getQueryData<{ pages: VideoPost[][] } | VideoPost[] | undefined>(
    cacheKey,
  );
  if (prev) {
    const mapper = (video: VideoPost) => (video.id === videoId ? updateFn(video) : video);

    if ('pages' in prev) {
      queryClient.setQueryData(cacheKey, {
        ...prev,
        pages: prev.pages.map((page) => page.map(mapper)),
      });
    }

    if (Array.isArray(prev)) {
      queryClient.setQueryData(cacheKey, prev.map(mapper));
    }
  }
  return prev;
};

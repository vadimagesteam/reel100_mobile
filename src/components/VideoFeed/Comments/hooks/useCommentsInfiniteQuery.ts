import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { queryClient } from '../../../../lib/api.ts';
import { apiFetchComments } from '../queries/apiFetchComments.ts';

export type CommentType = {
  id: string;
  replyTo: string;
  text: string;
  user: { id: string; firstName: string; lastName: string };
  video: { id: string };
  createdAt: string;
  updatedAt: string;
  likesCount: number;

  repliesCount: number;
  replies: CommentType[];
};

export type useCommentsInfiniteQueryParams = {
  limit?: number;
};

export const useCommentsInfiniteQuery = (
  videoId: string,
  params?: useCommentsInfiniteQueryParams,
) => {
  const { limit = 300 } = params ?? {};
  const cacheKey = useMemo(() => ['comments', 'video', videoId], [videoId]);

  const hookResult = useInfiniteQuery({
    queryKey: cacheKey,
    queryFn: async ({ pageParam = 0 }) => {
      return apiFetchComments({
        videoId,
        take: limit,
        skip: pageParam,
      });
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
    replies: [],
  };
};

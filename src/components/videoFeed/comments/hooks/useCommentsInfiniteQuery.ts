import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { queryClient } from '../../../../lib/api';
import { UserBase } from '../../../../state/user/types';
import { apiFetchComments } from '../queries/apiFetchComments';

export type CommentType = {
  id: string;
  replyTo: string;
  text: string;
  user: UserBase;
  video: { id: string };
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  // Viewer's own like state, resolved server-side in the comments list query
  // (see the backend listCommentsWithViewerLike). myReactionId is the id of the
  // viewer's Like reaction, needed to unlike without a second lookup.
  likedByMe: boolean;
  myReactionId: string | null;

  repliesCount: number;
  replies: CommentType[];
};

type CommentPages = { pages: CommentType[][]; pageParams: unknown[] };

export const commentsCacheKey = (videoId: string) => ['comments', 'video', videoId];

/**
 * Optimistically patch a single comment inside the infinite-query cache,
 * wherever it sits across loaded pages. Mirrors updateVideoCache. Returns the
 * previous cache so a failed mutation can roll it back.
 */
export const updateCommentCache = (
  cacheKey: readonly unknown[],
  commentId: string,
  updateFn: (comment: CommentType) => CommentType,
) => {
  const prev = queryClient.getQueryData<CommentPages>(cacheKey);
  if (!prev?.pages) {
    return prev;
  }
  queryClient.setQueryData<CommentPages>(cacheKey, {
    ...prev,
    pages: prev.pages.map((page) =>
      page.map((comment) => (comment.id === commentId ? updateFn(comment) : comment)),
    ),
  });
  return prev;
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

  // Refetch manually only the first page
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

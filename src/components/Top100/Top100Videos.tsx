import React, { useCallback } from 'react';
import { usePostsInfiniteQuery } from '../VideoFeed/queries/usePostsInfiniteQuery.ts';
import { VideoFeed } from '../VideoFeed/VideoFeed.tsx';

export const Top100Videos = () => {
  const cacheKey = 'top100_videos';
  const { fetchNextPage, hasNextPage, isFetchingNextPage, flatPages, refetch, isRefetching } =
    usePostsInfiniteQuery({ cacheKey });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <VideoFeed
      cacheKey={cacheKey}
      initialVideoIndex={0}
      isRefetching={isRefetching}
      refetch={refetch}
      videos={flatPages}
      onEndReached={onEndReached}
    />
  );
};

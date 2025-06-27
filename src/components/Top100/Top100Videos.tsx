import React, { useCallback, useEffect, useMemo } from 'react';
import { useVideosInfiniteQuery } from '../VideoFeed/hooks/useVideosInfiniteQuery.ts';
import { VideoList } from '../VideoFeed/VideoList.tsx';
import { useSetVideoFeedCacheKey } from '../VideoFeed/hooks/useSetVideoFeedCacheKey.ts';
import { useVideoPause } from '../VideoFeed/hooks/useVideoPause.ts';

export const Top100Videos = () => {
  const cacheKey = useMemo(() => ['top100_videos'], []);

  useSetVideoFeedCacheKey(cacheKey);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, flatPages, refetch, isRefetching } =
    useVideosInfiniteQuery({
      cacheKey,
      orderBy: {
        likesCount: 'desc',
      },
    });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <VideoList
      initialVideoIndex={0}
      isRefetching={isRefetching}
      refetch={refetch}
      videos={flatPages}
      onEndReached={onEndReached}
    />
  );
};

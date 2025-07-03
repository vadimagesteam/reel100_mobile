import React, { useCallback, useEffect, useMemo } from 'react';
import { useVideosInfiniteQuery } from '../videoFeed/hooks/useVideosInfiniteQuery.ts';
import { VideoList } from '../videoFeed/VideoList.tsx';
import { useSetVideoFeedCacheKey } from '../videoFeed/hooks/useSetVideoFeedCacheKey.ts';
import { useVideoPause } from '../videoFeed/hooks/useVideoPause.ts';

export const Top100Videos = () => {
  const cacheKey = useMemo(() => ['top100_videos'], []);

  useSetVideoFeedCacheKey(cacheKey);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, flatPages, refetch, isRefetching } =
    useVideosInfiniteQuery({
      cacheKey,
      where: {
        'where[status]': 'Finished',
      },
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

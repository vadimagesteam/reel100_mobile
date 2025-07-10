import { useCallback, useMemo } from 'react';
import { useVideosInfiniteQuery, useSetVideoFeedCacheKey } from '../videoFeed/hooks';
import { VideoList } from '../videoFeed';

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

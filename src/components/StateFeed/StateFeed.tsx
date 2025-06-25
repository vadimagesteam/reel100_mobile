import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePostsInfiniteQuery } from '../VideoFeed/queries/usePostsInfiniteQuery.ts';
import { VideoFeed } from '../VideoFeed/VideoFeed.tsx';
import { useAppPersistentStore } from '../../state/app/appPersistentStore.ts';
import {
  useVideoActions,
  useVideoPlayerStore,
} from '../../state/videoPlayer/videoVideoPlayerStore.ts';
import clsx from 'clsx';
import { TilesList } from './TilesList.tsx';
import { VideoPost } from '../VideoFeed/queries/apiVideosFetcher.ts';

export const StateFeed = () => {
  const { selectedState } = useAppPersistentStore();
  const isPlayerFullScreen = useVideoPlayerStore((s) => s.isPlayerFullScreen);
  const { setIsPlayerFullScreen } = useVideoActions();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const cacheKey = useMemo(
    () => ['state_feed', selectedState?.id ?? 'NO_STATE'],
    [selectedState?.id],
  );

  const { fetchNextPage, hasNextPage, isFetchingNextPage, flatPages, refetch, isRefetching } =
    usePostsInfiniteQuery({
      cacheKey,
      where: useMemo(
        () => ({
          'where[states][some][id]': selectedState?.id!,
        }),
        [selectedState?.id],
      ),
      orderBy: { createdAt: 'desc' },
    });

  const handleVideoOpen = useCallback(
    (video: VideoPost) => {
      if (video) {
        setExpandedIndex(flatPages.findIndex((v) => v.id === video.id));
        setIsPlayerFullScreen(true);
      }
    },
    [flatPages, setIsPlayerFullScreen],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isPlayerFullScreen && expandedIndex !== null) {
      setExpandedIndex(null);
    }
  }, [expandedIndex, isPlayerFullScreen]);

  const fullScreenVideos = useMemo(
    () => (expandedIndex !== null ? flatPages.slice(expandedIndex) : flatPages),
    [expandedIndex, flatPages],
  );

  return (
    <>
      <TilesList
        className={clsx(expandedIndex !== null ? 'hidden' : undefined)}
        onVideoClick={handleVideoOpen}
        videos={flatPages}
        isRefetching={isRefetching}
        onEndReached={onEndReached}
        refetch={refetch}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
      {expandedIndex !== null && (
        <VideoFeed
          cacheKey={cacheKey}
          initialVideoIndex={0}
          isRefetching={isRefetching}
          refetch={refetch}
          videos={fullScreenVideos}
          onEndReached={onEndReached}
        />
      )}
    </>
  );
};

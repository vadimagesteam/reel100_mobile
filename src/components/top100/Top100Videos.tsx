import { useFocusEffect } from '@react-navigation/native';
import { endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useStateSelector } from '../../state/app/uiStore';
import { FlexLoading } from '../ui';
import { useVideosInfiniteQuery, useSetVideoFeedCacheKey } from '../videoFeed/hooks';
import { VideoList } from '../videoFeed';
import { EmptyTop100Videos } from './EmptyTop100Videos';

export const Top100Videos = ({ isActiveTab }: { isActiveTab: boolean }) => {
  const [selectedState] = useStateSelector();
  const cacheKey = useMemo(() => ['top100_videos', selectedState?.id], [selectedState]);

  useSetVideoFeedCacheKey(cacheKey);

  const [shouldPoll, setShouldPoll] = useState(false);

  const { fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, flatPages, refetch } =
    useVideosInfiniteQuery({
      cacheKey,
      where: {
        status: 'Finished',
        createdAt: {
          gte: startOfDay(new Date()).toISOString(),
          lte: endOfDay(new Date()).toISOString(),
        },
        states: {
          some: {
            id: { equals: selectedState?.id! },
          },
        },
      },
      orderBy: [
        {
          likesCount: 'Desc',
        },
        {
          createdAt: 'Asc',
        },
      ],
      // for empty feed we want to poll
      refetchInterval: shouldPoll ? 3000 : undefined,
    });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isActiveTab && !flatPages.length) {
      refetch();
      setShouldPoll(true);
    } else {
      setShouldPoll(false);
    }
  }, [flatPages.length, isActiveTab, refetch]);

  useFocusEffect(
    useCallback(() => {
      if (isActiveTab && !flatPages.length) {
        refetch();
        setShouldPoll(true);
      }
      return () => {
        setShouldPoll(false);
      };
    }, [flatPages.length, isActiveTab, refetch]),
  );

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  // Show the full-screen spinner only on the first load of a given state. The
  // empty feed polls every 3s (refetchInterval) and triggers several background
  // refetches; React Query's `isLoading` can briefly flip true on those, which
  // would otherwise swap the empty-state screen for FlexLoading and "blink".
  // Once we've rendered settled content (even an empty result) for this
  // cacheKey, keep showing it and let refetches happen silently in the
  // background. Reset per-state (by key value) so switching to an uncached
  // state still shows one initial loader instead of flashing "no videos".
  const cacheKeyId = cacheKey.join('|');
  const settledKeyRef = useRef<string | null>(null);
  if (!isLoading) {
    settledKeyRef.current = cacheKeyId;
  }
  const isInitialLoad = isLoading && settledKeyRef.current !== cacheKeyId;

  if (isInitialLoad) {
    return <FlexLoading />;
  }

  return (
    <VideoList
      initialVideoIndex={0}
      isRefetching={isRefetching}
      refetch={handleRefresh}
      videos={flatPages}
      onEndReached={onEndReached}
      ListEmptyComponent={<EmptyTop100Videos stateLabel={selectedState?.label!} />}
    />
  );
};

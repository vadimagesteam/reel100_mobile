import { useFocusEffect } from '@react-navigation/native';
import { endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  if (isLoading) {
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

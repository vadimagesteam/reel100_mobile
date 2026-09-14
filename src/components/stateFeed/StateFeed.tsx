import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { useVideosInfiniteQuery, useSetVideoFeedCacheKey } from '../videoFeed/hooks';
import { VideoTiles } from '../videoTiles';
import { useStateSelector } from '../../state/app/uiStore';
import { centralDayRangeUtc } from '../../utils';

export const StateFeed = ({ isActiveTab }: { isActiveTab: boolean }) => {
  const [selectedState] = useStateSelector();

  const cacheKey = useMemo(
    () => ['state_feed', selectedState?.id ?? 'NO_STATE'],
    [selectedState?.id],
  );
  useSetVideoFeedCacheKey(cacheKey);

  const controllers = useVideosInfiniteQuery({
    cacheKey,
    where: useMemo(
      () => ({
        status: 'Finished',
        // Window the cycle in Central Time (matching the ranking + countdown),
        // not the device's local day — otherwise videos still in the active
        // Central cycle are dropped for users west of Central.
        createdAt: centralDayRangeUtc(),
        states: {
          some: {
            id: { equals: selectedState?.id! },
          },
        },
      }),
      [selectedState?.id],
    ),
    orderBy: [{ createdAt: 'Desc' }],
  });

  const { refetch } = controllers;

  useEffect(() => {
    if (isActiveTab) {
      refetch();
    }
  }, [isActiveTab, refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <VideoTiles queryControl={controllers} emptyTitle={`Rush the feed ${selectedState?.label}!`} />
  );
};

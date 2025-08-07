import { useFocusEffect } from '@react-navigation/native';
import { endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { useVideosInfiniteQuery, useSetVideoFeedCacheKey } from '../videoFeed/hooks';
import { VideoTiles } from '../videoTiles';
import { useStateSelector } from '../../state/app/uiStore';

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
        createdAt: {
          gte: startOfDay(new Date()).toISOString(),
          lte: endOfDay(new Date()).toISOString(),
        },
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

  return <VideoTiles queryControl={controllers} />;
};

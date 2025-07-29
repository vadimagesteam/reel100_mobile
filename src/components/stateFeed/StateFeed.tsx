import { useMemo } from 'react';
import { useVideosInfiniteQuery, useSetVideoFeedCacheKey } from '../videoFeed/hooks';
import { VideoTiles } from '../videoTiles/VideoTiles';
import { generateBlocks } from './helpers/generateBlocks';
import { useStateSelector } from '../../state/app/uiStore';

export const StateFeed = () => {
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
        'where[status]': 'Finished',
        'where[states][some][id]': selectedState?.id!,
      }),
      [selectedState?.id],
    ),
    orderBy: { createdAt: 'desc' },
  });

  return <VideoTiles queryControl={controllers} />;
};

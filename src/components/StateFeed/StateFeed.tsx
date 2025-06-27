import React, { useMemo } from 'react';
import { useVideosInfiniteQuery } from '../VideoFeed/hooks/useVideosInfiniteQuery.ts';
import { VideoTiles } from '../VideoTiles/VideoTiles.tsx';
import { TileListBlock } from './TileListBlock.tsx';
import { generateBlocks } from './helpers/generateBlocks.ts';
import { useSetVideoFeedCacheKey } from '../VideoFeed/hooks/useSetVideoFeedCacheKey.ts';
import { useStateSelector } from '../../state/app/uiStore.ts';

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
        'where[states][some][id]': selectedState?.id!,
      }),
      [selectedState?.id],
    ),
    orderBy: { createdAt: 'desc' },
  });

  return (
    <VideoTiles
      queryControl={controllers}
      ItemComponent={TileListBlock}
      prepareData={generateBlocks}
    />
  );
};

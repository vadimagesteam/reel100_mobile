import { cs } from '../../../screens/Dashboard/Profile/ProfileScreen/styles.ts';
import React, { useMemo } from 'react';
import { useVideosInfiniteQuery } from '../../VideoFeed/hooks/useVideosInfiniteQuery.ts';
import { VideoTiles } from '../../VideoTiles/VideoTiles.tsx';
import { VideoPost } from '../../VideoFeed/queries/apiVideosFetcher.ts';
import { VideoTile } from './VideoTile.tsx';
import { TileConfig } from './tileConfig.ts';
import { useSetVideoFeedCacheKey } from '../../VideoFeed/hooks/useSetVideoFeedCacheKey.ts';

export interface ProfileVideoTilesProps {
  userId: string;
  className?: string;
}

export const UserVideoTiles = ({ userId, className }: ProfileVideoTilesProps) => {
  const cacheKey = useMemo(() => ['user_videos', userId], [userId]);
  useSetVideoFeedCacheKey(cacheKey);

  const queryControl = useVideosInfiniteQuery({
    cacheKey,
    where: useMemo(
      () => ({
        'where[userId]': userId,
      }),
      [userId],
    ),
    orderBy: { createdAt: 'desc' },
  });

  return (
    <VideoTiles<VideoPost>
      className={className}
      ItemComponent={VideoTile}
      queryControl={queryControl}
      keyExtractor={(item) => item.id}
      numColumns={TileConfig.NumColumns}
      contentContainerStyle={[cs.pb10]}
      initialNumToRender={6}
      windowSize={5}
      maxToRenderPerBatch={6}
    />
  );
};

import { useMemo } from 'react';
import { VideoTiles } from '../../VideoTiles/VideoTiles.tsx';
import { VideoPost } from '../../VideoFeed/queries/apiVideosFetcher.ts';
import { VideoTile } from './VideoTile.tsx';
import { TileConfig } from './tileConfig.ts';
import { useSetVideoFeedCacheKey, useVideosInfiniteQuery } from '../../VideoFeed/hooks';

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
      contentContainerClassName="pb-[10px]"
      initialNumToRender={6}
      windowSize={5}
      maxToRenderPerBatch={6}
    />
  );
};

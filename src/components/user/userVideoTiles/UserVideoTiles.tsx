import { useEffect, useMemo, useState } from 'react';
import { VideoTiles } from '../../videoTiles';
import { VideoPost } from '../../videoFeed/queries/apiVideosFetcher';
import { useSetVideoFeedCacheKey, useVideosInfiniteQuery } from '../../videoFeed/hooks';

export interface ProfileVideoTilesProps {
  userId: string;
  withUnfinished?: boolean;
  className?: string;
}

export const UserVideoTiles = ({ userId, withUnfinished, className }: ProfileVideoTilesProps) => {
  const [shouldPoll, setShouldPoll] = useState<boolean>(false);
  const cacheKey = useMemo(() => ['user_videos', userId], [userId]);
  useSetVideoFeedCacheKey(cacheKey);

  const queryControl = useVideosInfiniteQuery({
    cacheKey,
    where: useMemo(
      () => ({
        user: { id: userId },
        ...(withUnfinished
          ? {}
          : {
              status: 'Finished',
            }),
      }),
      [userId, withUnfinished],
    ),
    orderBy: [{ createdAt: 'Desc' }],
    refetchInterval: shouldPoll ? 3000 : false,
  });

  // Automatically poll if there is uncompleted video
  const { flatPages } = queryControl;
  useEffect(() => {
    if (withUnfinished) {
      const hasUnfinished = flatPages.some(
        (v) => v.status === 'InProcess' || v.status === 'Pending',
      );
      setShouldPoll(hasUnfinished);
    }
  }, [withUnfinished, flatPages]);

  return (
    <VideoTiles<VideoPost>
      className={className}
      queryControl={queryControl}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerClassName="pb-[10px]"
      initialNumToRender={6}
      windowSize={5}
      maxToRenderPerBatch={6}
    />
  );
};

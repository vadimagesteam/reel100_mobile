import { useEffect, useMemo, useState } from 'react';
import { FlatListProps } from 'react-native';
import { useLoadingCallback } from '../../../hooks/useLoadingCallback';
import { useSetVideoFeedCacheKey, useVideosInfiniteQuery } from '../../videoFeed/hooks';
import { VideoPost } from '../../videoFeed/queries/apiVideosFetcher';
import { VideoTiles } from '../../videoTiles';

export interface ProfileVideoTilesProps {
  userId: string;
  withUnfinished?: boolean;
  className?: string;
  ListHeaderComponent?: FlatListProps<VideoPost>['ListHeaderComponent'];
  sortRanked?: boolean;
}

export const UserVideoTiles = ({
  userId,
  withUnfinished,
  sortRanked,
  className,
  ListHeaderComponent,
}: ProfileVideoTilesProps) => {
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
    orderBy: sortRanked
      ? [{ top_100Position: 'Asc' }, { createdAt: 'Desc' }]
      : [{ createdAt: 'Desc' }],
    refetchInterval: shouldPoll ? 3000 : false,
  });

  // Automatically poll if there is an uncompleted video
  const { flatPages } = queryControl;
  useEffect(() => {
    if (withUnfinished) {
      const hasUnfinished = flatPages.some(
        (v) => v.status === 'InProcess' || v.status === 'Pending',
      );
      setShouldPoll(hasUnfinished);
    }
  }, [withUnfinished, flatPages]);

  const [handleRefresh, isRefetching] = useLoadingCallback(queryControl.refetch);

  return (
    <VideoTiles<VideoPost>
      className={className}
      queryControl={queryControl}
      refetch={handleRefresh}
      isRefreshing={isRefetching}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerClassName="pb-[10px]"
      initialNumToRender={6}
      windowSize={5}
      maxToRenderPerBatch={6}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

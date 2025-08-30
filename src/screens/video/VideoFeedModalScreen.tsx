import { useCallback, useMemo } from 'react';
import { HidebleContainer } from '../../components/hidebleContainer';
import { VideoFeedProvider, VideoList } from '../../components/videoFeed';
import { useVideosInfiniteQuery } from '../../components/videoFeed/hooks';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useNavigation, useRoute } from '../../navigation';

export const VideoFeedModalScreen = () => {
  const { params } = useRoute<'VideoFeedModal'>();
  const navigation = useNavigation();

  const { queryParams, videoIndex, feedState } = params;

  const { flatPages, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useVideosInfiniteQuery(queryParams);

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = useMemo(
    () => (videoIndex ? flatPages.slice(videoIndex) : flatPages),
    [flatPages, videoIndex],
  );

  return (
    <HidebleContainer>
      <VideoFeedProvider
        initialState={{
          ...feedState,
          screenType: 'modal',
          isPlayerFullScreen: true,
          cacheKey: queryParams.cacheKey,
          backPressHandler: () => navigation.goBack(),
        }}
      >
        <VideoList
          initialVideoIndex={0}
          isRefetching={isRefetching}
          refetch={handleRefresh}
          videos={videos}
          onEndReached={onEndReached}
        />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

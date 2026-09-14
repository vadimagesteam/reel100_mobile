import { useCallback } from 'react';
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
    useVideosInfiniteQuery({
      ...queryParams,
      // The grid this modal opened from shares queryParams.cacheKey and has
      // already loaded the page holding the tapped video. Preserve those pages
      // instead of truncating the shared cache to page 1, which would drop the
      // tapped video when it lives beyond the first page.
      refetchFirstPageOnMount: false,
    });

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        {/*
          Pass the whole list and start the feed at the tapped position. This
          previously sliced off everything before `videoIndex` and opened at 0,
          which meant tapping the third tile physically removed the first two
          videos — there was nothing above to scroll back to.
        */}
        <VideoList
          initialVideoIndex={videoIndex ?? 0}
          isRefetching={isRefetching}
          refetch={handleRefresh}
          videos={flatPages}
          onEndReached={onEndReached}
        />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

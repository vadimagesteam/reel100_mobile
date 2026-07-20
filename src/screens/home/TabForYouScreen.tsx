import React, { useMemo } from 'react';
import { View } from 'react-native';
import { AppHeader, AppHeaderHeight } from '../../components/appHeader';
import { HideableView, HidebleContainer } from '../../components/hidebleContainer';
import { SearchRecommendations } from '../../components/search';
import { SearchInput } from '../../components/ui';
import { VideoFeedProvider } from '../../components/videoFeed';
import { useVideosInfiniteQuery } from '../../components/videoFeed/hooks';
import { VideoTiles } from '../../components/videoTiles';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';

export const TabForYouScreen = () => {
  const navigation = useNavigation();

  const cacheKey = useMemo(() => ['for_you_videos'], []);

  // The 4U feed itself is computed server-side (videos with >=3 likes + people
  // the user follows, minus one-way followers and already-watched videos) via
  // the `forMe` flag. The client just renders it and preserves watched-exclusion
  // by refetching the first page on mount.
  const controllers = useVideosInfiniteQuery({
    cacheKey,
    orderBy: [{ createdAt: 'Desc' }],
    where: {
      status: 'Finished',
      forMe: true,
    },
  });

  const { refetch } = controllers;
  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  // Never show a dead page: once the personalized feed has settled empty, fall
  // back to the search-bar recommendations (Most Active Creators + States).
  // `isFetching` is checked too so we don't flash recommendations during the
  // mount refetch when cached data could still arrive.
  const isEmptyFeed =
    !controllers.isLoading && !controllers.isFetching && controllers.flatPages.length === 0;

  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-background">
      <AppHeader />
      <HideableView>
        <SearchInput
          wrapperClassName="mx-[10px] mb-3 grow-0"
          value=""
          onFocus={(e) => {
            navigation.navigate(Screens.UserSearch);
            e.currentTarget.blur();
          }}
        />
      </HideableView>
      <VideoFeedProvider initialState={{ cacheKey: cacheKey }}>
        {isEmptyFeed ? (
          <View className="flex-1 px-4">
            <SearchRecommendations />
          </View>
        ) : (
          <VideoTiles
            refetch={handleRefresh}
            isRefreshing={isRefetching}
            queryControl={controllers}
            emptyTitle="Use RushRanks and we'll do the rest"
          />
        )}
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

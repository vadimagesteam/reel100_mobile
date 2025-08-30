import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { AppHeader, AppHeaderHeight } from '../../components/appHeader';
import { HideableView, HidebleContainer } from '../../components/hidebleContainer';
import { SearchInput } from '../../components/ui';
import { VideoFeedProvider } from '../../components/videoFeed';
import { useVideosInfiniteQuery } from '../../components/videoFeed/hooks';
import { VideoTiles } from '../../components/videoTiles';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { Screens } from '../../navigation/screens';
import { UserType } from '../../state/user/types';

export const TabForYouScreen = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const navigation = useNavigation<any>();

  const cacheKey = useMemo(
    () => (selectedUser ? ['for_you_videos', selectedUser.id] : ['for_you_videos']),
    [selectedUser],
  );

  const controllers = useVideosInfiniteQuery({
    cacheKey,
    orderBy: [{ createdAt: 'Desc' }],
    where: {
      status: 'Finished',
      forMe: true,
      ...(selectedUser
        ? {
            user: { id: selectedUser.id },
          }
        : {}),
    },
  });

  const { refetch } = controllers;

  const [handleRefresh, isRefetching] = useLoadingCallback(refetch);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const searchByFullName = selectedUser
    ? `${selectedUser?.firstName} ${selectedUser?.lastName}`
    : null;

  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-background">
      <AppHeader />
      <HideableView>
        <SearchInput
          wrapperClassName="mx-[10px] mb-3 grow-0"
          value={searchByFullName ?? ''}
          onClear={() => setSelectedUser(null)}
          onFocus={(e) => {
            navigation.navigate(Screens.UserFollowingSearch, {
              onSelected: setSelectedUser,
            });
            e.currentTarget.blur();
          }}
        />
      </HideableView>
      <VideoFeedProvider initialState={{ cacheKey: cacheKey }}>
        <VideoTiles
          refetch={handleRefresh}
          isRefreshing={isRefetching}
          queryControl={controllers}
          emptyMessage={
            searchByFullName ? `${searchByFullName} is not uploaded any videos` : undefined
          }
        />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

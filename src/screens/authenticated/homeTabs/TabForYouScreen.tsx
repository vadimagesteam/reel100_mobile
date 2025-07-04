import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { AppHeader, AppHeaderHeight } from '../../../components/appHeader/AppHeader';
import { HideableView, HidebleContainer } from '../../../components/hidebleContainer';
import { SearchInput } from '../../../components/ui';
import { VideoFeedProvider } from '../../../components/videoFeed';
import { useVideosInfiniteQuery } from '../../../components/videoFeed/hooks';
import { TileListBlock, generateBlocks } from '../../../components/stateFeed';
import { VideoTiles } from '../../../components/videoTiles/VideoTiles';
import { Screens } from '../../../navigation/screens';
import { UserType } from '../../../state/user/types';
import { FriendUserSearchRouteParams } from '../screens/FriendUserSearch';

export const TabForYouScreen = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const navigation = useNavigation<any>();

  const cacheKey = useMemo(
    () => (selectedUser ? ['for_you_videos', selectedUser.id] : ['for_you_videos']),
    [selectedUser],
  );

  const controllers = useVideosInfiniteQuery({
    cacheKey,
    orderBy: { createdAt: 'desc' },
    where: {
      'where[status]': 'Finished',
      ...(selectedUser
        ? {
            'where[user][id]': selectedUser.id,
          }
        : {}),
    },
  });

  const searchByFullName = selectedUser
    ? `${selectedUser?.firstName} ${selectedUser?.lastName}`
    : null;

  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-black4">
      <AppHeader stateSelect />
      <HideableView>
        <SearchInput
          wrapperClassName="mx-[10px] mb-3 grow-0"
          value={searchByFullName ?? ''}
          onClear={() => setSelectedUser(null)}
          onFocus={(e) => {
            navigation.navigate(Screens.FriendUserSearch, {
              onSelected: setSelectedUser,
            } as FriendUserSearchRouteParams);
            e.currentTarget.blur();
          }}
        />
      </HideableView>
      <VideoFeedProvider initialState={{ cacheKey: cacheKey }}>
        <VideoTiles
          queryControl={controllers}
          ItemComponent={TileListBlock}
          prepareData={generateBlocks}
          emptyMessage={
            searchByFullName ? `${searchByFullName} is not uploaded any videos` : undefined
          }
        />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

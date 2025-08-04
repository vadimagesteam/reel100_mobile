import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { type Route, type SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import { useUserQuery } from '../../components/user/hooks';
import { useBlockedUsers } from '../../components/user/hooks/useBlockedUsers';
import { useUserSearchableFollowRelations } from '../../components/user/userFollowRelations/useUserSearchableFollowRelations';
import { SearchableUserList } from '../../components/userList';
import { Screens } from '../../navigation/screens';
import { useUser } from '../../state/user/authStore';
import { UserBase } from '../../state/user/types';
import { getDisplayName } from '../../state/user/utils';
import { colors } from '../../theme';
import { useNavigation, useRoute } from '../../navigation';

type TabRoutes = 'followers' | 'following' | 'blocked';

export type ProfileStatsRouteParams = {
  userId: string;
  initialTab: TabRoutes;
};

type TabRoute = { key: TabRoutes; title: string };

const BaseTabRoutes: TabRoute[] = [
  { key: 'followers', title: 'Followers' },
  { key: 'following', title: 'Following' },
];

const TabRoutesWithBlocked: TabRoute[] = [...BaseTabRoutes, { key: 'blocked', title: 'Blocked' }];

export const ProfileStatsScreen = () => {
  const navigation = useNavigation();
  const {
    params: { userId, initialTab = 'followers' },
  } = useRoute<'ProfileStats'>();

  const me = useUser();
  const layout = useWindowDimensions();
  const { data: user, isLoading } = useUserQuery(userId);

  const isMyProfile = me.id === userId;

  const { data: blockedUsers, isLoading: isBlockingUsersLoading } = useBlockedUsers(isMyProfile); // load blocked users for my profile

  const [routes, setRoutes] = useState<TabRoute[]>(BaseTabRoutes);

  useEffect(() => {
    setRoutes(isMyProfile && blockedUsers?.length ? TabRoutesWithBlocked : BaseTabRoutes);
  }, [blockedUsers, isMyProfile]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: user ? getDisplayName(user) : 'loading...',
    });
  }, [navigation, user]);

  const [index, setIndex] = useState(() =>
    Math.max(
      routes.findIndex((r) => r.key === initialTab),
      0,
    ),
  );

  const { data: followers, setSearchQuery: setFollowersSearch } = useUserSearchableFollowRelations(
    user,
    'followers',
  );

  const { data: following, setSearchQuery: setFollowingSearch } = useUserSearchableFollowRelations(
    user,
    'following',
  );

  const handleUserPress = useCallback(
    (_user: UserBase) => {
      navigation.navigate(Screens.Profile, { user: _user });
    },
    [navigation],
  );

  const renderScene = useCallback(
    ({ route }: SceneRendererProps & { route: Route }) => {
      const key = route.key as TabRoutes;
      if (key === 'followers') {
        return (
          <SearchableUserList
            onSearch={setFollowersSearch}
            data={followers}
            isLoading={isLoading}
            onPress={handleUserPress}
          />
        );
      }
      if (key === 'following') {
        return (
          <SearchableUserList
            onSearch={setFollowingSearch}
            data={following}
            isLoading={isLoading}
            onPress={handleUserPress}
          />
        );
      }
      if (key === 'blocked') {
        return (
          <SearchableUserList
            onSearch={() => {}}
            data={blockedUsers}
            isLoading={isBlockingUsersLoading}
            onPress={handleUserPress}
          />
        );
      }
    },
    [
      setFollowersSearch,
      followers,
      isLoading,
      handleUserPress,
      setFollowingSearch,
      following,
      blockedUsers,
      isBlockingUsersLoading,
    ],
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => {
        return (
          <TabBar {...props} indicatorStyle={styles.indicatorStyle} style={styles.tabBarStyle} />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  indicatorStyle: { backgroundColor: colors.white },
  tabBarStyle: { backgroundColor: colors.black4 },
});

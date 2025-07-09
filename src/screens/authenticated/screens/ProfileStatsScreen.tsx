import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { type Route, type SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import { useUserQuery } from '../../../components/profile/hooks/useUserQuery';
import { SearchableUserList } from '../../../components/userList';
import { Screens } from '../../../navigation/screens';
import { useUser } from '../../../state/user/authStore';
import { UserBase } from '../../../state/user/types';
import { getFullName } from '../../../state/user/utils';
import { colors } from '../../../theme/colors';

type TabRoutes = 'followers' | 'following';

export type ProfileStatsRouteParams = {
  userId: string;
  initialTab: TabRoutes;
};

const routes: { key: TabRoutes; title: string }[] = [
  { key: 'followers', title: 'Followers' },
  { key: 'following', title: 'Following' },
];

export const ProfileStatsScreen = () => {
  const navigation = useNavigation<any>();
  const {
    params: { userId, initialTab = 'followers' },
  } = useRoute<
    RouteProp<{
      params: ProfileStatsRouteParams;
    }>
  >();

  const layout = useWindowDimensions();
  const me = useUser();
  const { data: user, isLoading } = useUserQuery(userId);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: user ? getFullName(user) : 'loading...',
    });
  }, [navigation, user]);

  const [index, setIndex] = useState(() =>
    Math.max(
      routes.findIndex((r) => r.key === initialTab),
      0,
    ),
  );

  // Todo: ideally these must be handled in separated scene components
  const [followersSearch, setFollowersSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');

  const followers = useMemo(() => {
    const list = user?.whoms.map((v) => v.who);
    const q = followersSearch.toLowerCase().trim();
    return q ? list?.filter((r) => getFullName(r).toLowerCase().includes(q)) : list;
  }, [user, followersSearch]);

  const following = useMemo(() => {
    const list = user?.follows.map((v) => v.whom);
    const q = followingSearch.toLowerCase().trim();
    return q ? list?.filter((r) => getFullName(r).toLowerCase().includes(q)) : list;
  }, [user, followingSearch]);

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
    },
    [followers, following, isLoading, handleUserPress],
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

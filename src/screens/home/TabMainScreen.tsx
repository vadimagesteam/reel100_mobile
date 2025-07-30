import { useCallback, useState } from 'react';
import { useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type SceneRendererProps, type Route, TabView, TabBar } from 'react-native-tab-view';
import { Top100Videos } from '../../components/top100/Top100Videos';
import { SvgIcon } from '../../components/ui';
import { colors } from '../../theme';
import { AppHeader, useGeoLocationState } from '../../components/appHeader';
import { Top100VideosByDate } from '../../components/top100/Top100VideosByDate';
import { StateFeed } from '../../components/stateFeed';
import { HidebleContainer } from '../../components/hidebleContainer';
import { TabAwareVideoFeedProvider } from '../../components/videoFeed';

const routes = [
  { key: 'top100', title: '', icon: 'top100Tab' },
  { key: 'state_feed', title: '', icon: 'stateFeedTab' },
  { key: 'top_video', title: '', icon: 'calendarTab' },
];

const TopBarHeight = 50;

export const TabMainScreen = () => {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = useCallback(
    ({ route }: SceneRendererProps & { route: Route }) => {
      const isActiveTab = route.key === routes[index].key;

      switch (route.key) {
        case 'top100':
          return (
            <TabAwareVideoFeedProvider isActiveTab={isActiveTab}>
              <Top100Videos isActiveTab={isActiveTab} />
            </TabAwareVideoFeedProvider>
          );
        case 'state_feed':
          return (
            <TabAwareVideoFeedProvider isActiveTab={isActiveTab}>
              <StateFeed isActiveTab={isActiveTab} />
            </TabAwareVideoFeedProvider>
          );
        case 'top_video':
          return (
            <TabAwareVideoFeedProvider isActiveTab={isActiveTab}>
              <Top100VideosByDate />
            </TabAwareVideoFeedProvider>
          );
        default:
          return null;
      }
    },
    [index],
  );

  // Try to identify state using Geo coords
  useGeoLocationState();

  const hideOffset = TopBarHeight + insets.top + 1;

  return (
    <HidebleContainer
      hideOffset={Platform.select({
        ios: hideOffset,
        android: hideOffset + 35,
      })}
      className="flex-1 bg-background"
    >
      <AppHeader />
      <TabView
        lazy
        className="mt-10"
        commonOptions={{
          icon: ({ route }) => <SvgIcon image={route.icon} />,
        }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenW }}
        renderTabBar={(props) => {
          return (
            <TabBar {...props} indicatorStyle={styles.indicatorStyle} style={styles.tabBarStyle} />
          );
        }}
      />
    </HidebleContainer>
  );
};

const styles = StyleSheet.create({
  indicatorStyle: { backgroundColor: colors.primary },
  tabBarStyle: { backgroundColor: colors.background, height: TopBarHeight },
});

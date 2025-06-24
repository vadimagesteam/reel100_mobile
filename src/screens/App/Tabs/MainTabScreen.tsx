import React, { useEffect } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';
import { useVideoPlayerStore } from '../../../state/videoPlayer/videoVideoPlayerStore.ts';
import { Top100Videos } from '../../../components/Top100/Top100Videos.tsx';
import { SvgIcon } from '../../../components/old/UI';

import { StateFeedTab, TopOneHundredTab } from '../../../components/old/TabViewVideo/components';
import { colors } from '../../../theme/colors.ts';
import { VideoCommentsOverlay } from '../../../components/VideoFeed/Comments/VideoCommentsOverlay.tsx';
import { GlobalCountdown } from '../../../components/AppHeader/GlobalCountdown/GlobalCountdown.tsx';
import CustomHeader from '../../../components/old/navigator/CustomHeader';
import { AppHeader, AppHeaderHeight } from '../../../components/AppHeader/AppHeader.tsx';

const MemoStateFeedTab = React.memo(StateFeedTab);

const renderScene = SceneMap({
  top100: Top100Videos,
  state_feed: () => (
    <SafeAreaView>
      <MemoStateFeedTab />
    </SafeAreaView>
  ),
  top_video: () => <TopOneHundredTab withCalendar />,
});

const routes = [
  { key: 'top100', title: '', icon: 'top100Tab' },
  { key: 'state_feed', title: '', icon: 'stateFeedTab' },
  { key: 'top_video', title: '', icon: 'calendarTab' },
];

const TopBarHeight = 50;

export function MainTabScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const isFull = useVideoPlayerStore((s) => s.isPlayerFullScreen);

  const isFullShared = useSharedValue(isFull);

  useEffect(() => {
    isFullShared.set(() => isFull);
  }, [isFull, isFullShared]);

  const containerStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    top: withTiming(isFullShared.value ? -TopBarHeight - insets.top - AppHeaderHeight : 0, {
      duration: 100,
    }),
    paddingTop: insets.top,
  }));

  return (
    <Animated.View className="flex-1 bg-black4" style={containerStyles}>
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
            <>
              <AppHeader stateSelect />
              <TabBar
                {...props}
                indicatorStyle={styles.indicatorStyle}
                style={styles.tabBarStyle}
              />
            </>
          );
        }}
      />
      <VideoCommentsOverlay />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  indicatorStyle: { backgroundColor: colors.white },
  tabBarStyle: { backgroundColor: colors.black4, height: TopBarHeight },
});

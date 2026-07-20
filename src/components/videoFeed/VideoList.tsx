import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '../../navigation';
import { isAndroid } from '../../utils';
import { useHideableContainer } from '../hidebleContainer';
import { AdFeedItemComponent } from './ads/AdFeedItem';
import { useNativeAdLoader } from './ads/hooks/useNativeAdLoader';
import { AD_INTERVAL, FeedItem } from './ads/types';
import { useInterleaveAds } from './ads/useInterleaveAds';
import { CommentsBottomSheet } from './comments/CommentsBottomSheet';
import {
  useLayoutDimensions,
  useFlatListLayoutChangeScrollFix,
  useLikeMutations,
  useVideoFullscreen,
  useVideoPause,
  useVideoFeed,
} from './hooks';
import { LikeAnimation, LikeAnimationRef } from './LikeAnimation';

import { VideoPost } from './queries/apiVideosFetcher';
import { ReportBottomSheet } from './report/ReportBottomSheet';
import { ShareBottomSheet } from './share/ShareBottomSheet';
import { VideoListItem } from './VideoListItem';

export interface SwipeableVideosListProps
  extends Omit<FlatListProps<FeedItem>, 'data' | 'renderItem' | 'refreshing'> {
  videos: VideoPost[];
  isRefetching?: boolean;
  refetch?: () => void;
  initialVideoIndex: number;
  showTopRank?: boolean;
}

export const VideoList: FC<SwipeableVideosListProps> = ({
  videos,
  refetch,
  initialVideoIndex,
  isRefetching = false,
  showTopRank = true,
  ...flatListProps
}) => {
  // const screenType = useVideoFeed((s) => s.screenType);
  const backPressHandler = useVideoFeed((s) => s.backPressHandler);
  const { closeComments } = useVideoFeed((s) => s.actions);
  const { isFullscreen, setFullscreen } = useVideoFullscreen();
  const { isPaused, setIsPaused, togglePause } = useVideoPause();

  const flatListRef = useRef<FlatList<FeedItem>>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewPaused, setViewPaused] = useState(false);
  const { dimensions, onLayout } = useLayoutDimensions();

  // Ads — inline native ads interleaved every AD_INTERVAL videos
  const { consumeAd, poolSize } = useNativeAdLoader();
  const feedItems = useInterleaveAds(videos, consumeAd, poolSize);

  // Fullscreen: hide container
  const { show: showHeader, hide: hideHeaders } = useHideableContainer();
  useEffect(() => {
    if (isFullscreen) {
      hideHeaders();
    } else {
      showHeader();
    }
  }, [hideHeaders, isFullscreen, showHeader]);

  // Exit from full-screen if tab changed or the same tab tapped
  const navigation = useNavigation();
  useEffect(() => {
    let listener = () => {
      if (isFullscreen) {
        setFullscreen(false);
      }
    };
    if (isFullscreen) {
      navigation.addListener('tabPress', listener);
    }
    return () => navigation.removeListener('tabPress', listener);
  }, [navigation, isFullscreen, setFullscreen]);

  const fullScreenRef = useRef(isFullscreen);
  const likeAnimationRef = useRef<LikeAnimationRef>(null);
  useEffect(() => {
    if (fullScreenRef.current && !isFullscreen && viewPaused) {
      setViewPaused(false);
    }
  }, [isFullscreen, viewPaused]);

  const { like } = useLikeMutations();

  const handleDoubleTap = (x: number, y: number) => {
    const activeItem = feedItems[activeIndex];
    if (activeItem?.type === 'video') {
      likeAnimationRef.current?.trigger(x, y); // show "Like" animation
      setTimeout(() => {
        // wait for the animation end (1 sec)
        like.mutate({
          type: 'video',
          id: activeItem.data.id,
          authorId: activeItem.data.user.id,
        });
      }, likeAnimationRef.current?.animationDuration ?? 0);
    }
  };

  const handleSingleTap = () => {
    if (isFullscreen) {
      togglePause();
    } else {
      setFullscreen(true);
      fullScreenRef.current = true;
      closeComments();
    }
  };

  const handleBackSwipe = () => {
    if (backPressHandler) {
      backPressHandler();
    } else {
      setFullscreen(false);
    }
  };

  const swipeTranslateX = useSharedValue(0);
  const swipeTranslateY = useSharedValue(0);

  // These handlers close over state that changes on nearly every render, so
  // useCallback would not stabilize them. Routing the gestures through a ref
  // lets the gesture objects below be memoized against only their `enabled`
  // flags — so GestureDetector re-attaches the native handler when
  // fullscreen/emptiness actually flips, rather than on every render. Handler
  // churn mid-touch is a known source of the local/UIKit touch-registry desync
  // behind the app-wide dead-tap bug.
  const handlersRef = useRef({
    handleSingleTap,
    handleDoubleTap,
    handleBackSwipe,
    setIsPaused,
  });

  // Refreshed after commit rather than during render: a render that React
  // starts and then discards must not leave the ref pointing at handlers that
  // were never shown. Gesture callbacks only fire post-commit, so they always
  // observe the committed values.
  useLayoutEffect(() => {
    handlersRef.current = {
      handleSingleTap,
      handleDoubleTap,
      handleBackSwipe,
      setIsPaused,
    };
  });

  // Stable identities for the UI thread to call back into; they always read the
  // freshest handler off the ref above.
  const invokeSingleTap = useCallback(() => handlersRef.current.handleSingleTap(), []);
  const invokeDoubleTap = useCallback(
    (x: number, y: number) => handlersRef.current.handleDoubleTap(x, y),
    [],
  );
  const invokeBackSwipe = useCallback(() => handlersRef.current.handleBackSwipe(), []);
  const setPausedFromRef = useCallback(
    (paused: boolean) => handlersRef.current.setIsPaused(paused),
    [],
  );

  const hasFeedItems = feedItems.length > 0;

  const backSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(isFullscreen)
        .activeOffsetX(10)
        .onStart(() => {
          runOnJS(setPausedFromRef)(true);
        })
        .onUpdate((e) => {
          swipeTranslateX.value = e.translationX;
          swipeTranslateY.value = e.translationY;
        })
        .onEnd((e) => {
          swipeTranslateX.value = withTiming(0);
          swipeTranslateY.value = withTiming(0);

          if (e.translationX > 120 && (isAndroid || e.velocityX > 100)) {
            runOnJS(invokeBackSwipe)();
          } else {
            runOnJS(setPausedFromRef)(false);
          }
        }),
    [invokeBackSwipe, isFullscreen, setPausedFromRef, swipeTranslateX, swipeTranslateY],
  );

  const singleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(hasFeedItems)
        .shouldCancelWhenOutside(true)
        .maxDuration(250)
        .onEnd(() => {
          runOnJS(invokeSingleTap)();
        }),
    [hasFeedItems, invokeSingleTap],
  );

  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(hasFeedItems)
        .numberOfTaps(2)
        .onEnd((e) => {
          runOnJS(invokeDoubleTap)(e.x, e.y);
        }),
    [hasFeedItems, invokeDoubleTap],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      if (item.type === 'ad') {
        return (
          <AdFeedItemComponent
            nativeAd={item.data}
            dimensions={dimensions}
          />
        );
      }

      return (
        <VideoListItem
          video={item.data}
          dimensions={dimensions}
          active={activeIndex === index}
          showTopRank={showTopRank}
        />
      );
    },
    [dimensions, activeIndex, showTopRank],
  );

  const onViewableItemsChanged = useCallback<
    NonNullable<FlatListProps<FeedItem>['onViewableItemsChanged']>
  >(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index;
        if (index !== undefined && index !== null) {
          setActiveIndex(index);
          // Unpause when swiping to another video
          if (isPaused) {
            togglePause();
          }
        }
      }
    },
    [isPaused, togglePause],
  );

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 80 }), []);

  // When video container became bigger we need to reScroll as items height is changed
  useFlatListLayoutChangeScrollFix(flatListRef, activeIndex, dimensions.height);

  const isFullscreenShared = useSharedValue(isFullscreen);
  useEffect(() => {
    isFullscreenShared.value = isFullscreen;
  }, [isFullscreen, isFullscreenShared]);

  const viewStyle = useAnimatedStyle(
    () => ({
      borderRadius: swipeTranslateX.value ? 40 : 0,
      transform: [
        {
          scale: interpolate(swipeTranslateX.value, [0, 500], [1, 0.5], Extrapolation.CLAMP),
        },
        {
          rotate: `${interpolate(swipeTranslateX.value, [0, 500], [0, 0.5], Extrapolation.CLAMP)}deg`,
        },
        { translateX: swipeTranslateX.value },
        { translateY: swipeTranslateY.value },
      ],
    }),
    [],
  );

  const gesturesCombined = useMemo(
    () => Gesture.Exclusive(backSwipeGesture, doubleTapGesture, singleTapGesture),
    [backSwipeGesture, doubleTapGesture, singleTapGesture],
  );
  const VideoBatchSize = 6;

  // Convert video index to feed index (accounting for interleaved ads)
  const initialFeedIndex = useMemo(() => {
    if (initialVideoIndex <= 0) {
      return initialVideoIndex;
    }
    const adsBeforeIndex = Math.floor(initialVideoIndex / AD_INTERVAL);
    return initialVideoIndex + adsBeforeIndex;
  }, [initialVideoIndex]);

  const initialized = useRef(false);
  useEffect(() => {
    if (initialFeedIndex > -1 && !initialized.current) {
      flatListRef.current?.scrollToOffset({
        offset: initialFeedIndex * dimensions.height,
        animated: false,
      });
      setTimeout(() => {
        initialized.current = true;
      }, 600);
    }
  }, [dimensions.height, initialFeedIndex]);

  return (
    <Animated.View className="flex-1 overflow-hidden bg-background" style={viewStyle}>
      <GestureDetector gesture={gesturesCombined}>
        <FlatList<FeedItem>
          ref={flatListRef}
          contentContainerClassName="grow"
          disableIntervalMomentum // 1 video per one swipe
          onLayout={onLayout}
          getItemLayout={(data, index) => ({
            length: dimensions.height,
            offset: dimensions.height * index,
            index,
          })}
          data={feedItems}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          // initialScrollIndex={initialVideoIndex}
          onEndReachedThreshold={0.3}
          initialNumToRender={VideoBatchSize}
          windowSize={VideoBatchSize}
          maxToRenderPerBatch={VideoBatchSize}
          removeClippedSubviews={isAndroid}
          decelerationRate="fast"
          scrollEventThrottle={1}
          pagingEnabled
          snapToAlignment="start"
          snapToInterval={dimensions.height}
          refreshControl={
            refetch && (
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={['#fff']}
                tintColor="#fff"
              />
            )
          }
          {...flatListProps}
        />
      </GestureDetector>
      <LikeAnimation ref={likeAnimationRef} />
      <CommentsBottomSheet />
      <ShareBottomSheet />
      <ReportBottomSheet />
    </Animated.View>
  );
};

import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';

import { VideoPost } from './queries/apiVideosFetcher.ts';
import { VideoListItem } from './VideoListItem';
import { LikeAnimation, LikeAnimationRef } from './LikeAnimation';
import {
  useLayoutDimensions,
  useFlatListLayoutChangeScrollFix,
  useLikeMutations,
  useVideoFullscreen,
  useVideoPause,
  useVideoFeed,
} from './hooks';
import { useHideableContainer } from '../hidebleContainer';
import { CommentsBottomSheet } from './comments/CommentsBottomSheet';
import { ShareBottomSheet } from './share/ShareBottomSheet';

export interface SwipeableVideosListProps
  extends Omit<FlatListProps<VideoPost>, 'data' | 'renderItem' | 'refreshing'> {
  videos: VideoPost[];
  isRefetching: boolean;
  refetch: () => void;
  initialVideoIndex: number;
}

export const VideoList: FC<SwipeableVideosListProps> = ({
  videos,
  refetch,
  initialVideoIndex,
  isRefetching,
  ...flatListProps
}) => {
  const { closeComments } = useVideoFeed((s) => s.actions);
  const { isFullscreen, setFullscreen } = useVideoFullscreen();
  const { isPaused, togglePause } = useVideoPause();

  const flatListRef = useRef<FlatList<VideoPost>>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewPaused, setViewPaused] = useState(false);
  const { dimensions, onLayout } = useLayoutDimensions();

  // Fullscreen: hide container
  const { show: showHeader, hide: hideHeaders } = useHideableContainer();
  useEffect(() => {
    if (isFullscreen) {
      hideHeaders();
    } else {
      showHeader();
    }
  }, [hideHeaders, isFullscreen, showHeader]);

  const fullScreenRef = useRef(isFullscreen);
  const likeAnimationRef = useRef<LikeAnimationRef>(null);
  useEffect(() => {
    if (fullScreenRef.current && !isFullscreen && viewPaused) {
      setViewPaused(false);
    }
  }, [isFullscreen, viewPaused]);

  const { like } = useLikeMutations();

  const handleDoubleTap = () => {
    if (videos[activeIndex]) {
      likeAnimationRef.current?.trigger(); // show "Like" animation
      setTimeout(() => {
        // wait for animation end (1 sec)
        like.mutate({
          type: 'video',
          id: videos[activeIndex].id,
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

  const backSwipeGesture = Gesture.Pan()
    .enabled(isFullscreen)
    .onEnd((e) => {
      if (isFullscreen && e.translationX > 50 && e.velocityX > 440) {
        runOnJS(setFullscreen)(false);
      }
    })
    // android
    .activeOffsetX(20)
    .failOffsetY([-10, 10]);

  const singleTapGesture = Gesture.Tap()
    .enabled(videos.length > 0)
    .shouldCancelWhenOutside(true)
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(handleSingleTap)();
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(videos.length > 0)
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleDoubleTap)();
    });

  const renderItem = useCallback(
    ({ item: video, index }: { item: VideoPost; index: number }) => {
      return (
        <VideoListItem
          video={video}
          dimensions={dimensions}
          active={activeIndex === index}
          showImagePreview
          rankNumber={index + 1}
        />
      );
    },
    [dimensions, activeIndex],
  );

  const onViewableItemsChanged = useCallback<
    NonNullable<FlatListProps<VideoPost>['onViewableItemsChanged']>
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
      zIndex: 20,
      opacity: isFullscreenShared.value
        ? withSequence(
            withTiming(0, { duration: 100 }),
            withDelay(500, withTiming(1, { duration: 200 })),
          )
        : withTiming(1),
    }),
    [isFullscreenShared],
  );

  const gesturesCombined = Gesture.Exclusive(backSwipeGesture, doubleTapGesture, singleTapGesture);

  return (
    <Animated.View className="flex-1 bg-black4" style={viewStyle}>
      <GestureDetector gesture={gesturesCombined}>
        <FlatList<VideoPost>
          ref={flatListRef}
          contentContainerClassName="grow"
          disableIntervalMomentum // 1 video per one swipe
          onLayout={onLayout}
          getItemLayout={(data, index) => ({
            length: dimensions.height,
            offset: dimensions.height * index,
            index,
          })}
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={initialVideoIndex}
          onEndReachedThreshold={0.3}
          initialNumToRender={4}
          windowSize={4}
          maxToRenderPerBatch={4}
          removeClippedSubviews={false}
          decelerationRate="fast"
          scrollEventThrottle={1000 / 60}
          pagingEnabled
          snapToAlignment="start"
          snapToInterval={dimensions.height}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#fff']}
              tintColor="#fff"
            />
          }
          {...flatListProps}
        />
      </GestureDetector>
      <LikeAnimation ref={likeAnimationRef} />
      <CommentsBottomSheet />
      <ShareBottomSheet />
    </Animated.View>
  );
};

import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useVideoActions,
  useVideoPlayerStore,
} from '../../state/videoPlayer/videoVideoPlayerStore.ts';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';

import { VideoPost } from './queries/apiVideosFetcher.ts';
import { useLayoutDimensions } from './hooks/useLayoutDimensions.ts';
import { VideoListItem } from './VideoListItem.tsx';
import { useFlatListLayoutChangeScrollFix } from './hooks/useFlatListLayoutChangeScrollFix.ts';
import { LikeAnimation, LikeAnimationRef } from './LikeAnimation.tsx';
import { useLikeMutations } from './queries/useLikeMutations.ts';

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
  // video state
  const { setIsPlayerFullScreen, togglePause, closeComments } = useVideoActions();
  const isPaused = useVideoPlayerStore((s) => s.isPaused);
  const isPlayerFullScreen = useVideoPlayerStore((s) => s.isPlayerFullScreen);

  const flatListRef = useRef<FlatList<VideoPost>>(null);

  const scrollIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewPaused, setViewPaused] = useState(false);
  const { dimensions, onLayout } = useLayoutDimensions();

  const fullScreenRef = useRef(isPlayerFullScreen);
  const likeAnimationRef = useRef<LikeAnimationRef>(null);
  useEffect(() => {
    if (fullScreenRef.current && !isPlayerFullScreen && viewPaused) {
      setViewPaused(false);
    }
  }, [isPlayerFullScreen, viewPaused]);

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
    if (isPlayerFullScreen) {
      togglePause();
    } else {
      setIsPlayerFullScreen(true);
      fullScreenRef.current = true;
      closeComments();
    }
  };

  const backSwipeGesture = Gesture.Pan().onEnd((e) => {
    if (isPlayerFullScreen && e.translationX > 50 && e.velocityX > 500) {
      runOnJS(setIsPlayerFullScreen)(false);
    }
  });

  const singleTapGesture = Gesture.Tap()
    .shouldCancelWhenOutside(true)
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(handleSingleTap)();
    });

  const doubleTapGesture = Gesture.Tap()
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
          scrollIndexRef.current = index;
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

  const viewStyle = useAnimatedStyle(
    () => ({
      zIndex: 20,
      opacity: isPlayerFullScreen
        ? withSequence(
            withTiming(0, { duration: 100 }),
            withDelay(500, withTiming(1, { duration: 200 })),
          )
        : withTiming(1),
    }),
    [isPlayerFullScreen],
  );

  const gesturesCombined = Gesture.Exclusive(backSwipeGesture, doubleTapGesture, singleTapGesture);

  return (
    <Animated.View className="flex-1 bg-black4" style={viewStyle}>
      <GestureDetector gesture={gesturesCombined}>
        <FlatList<VideoPost>
          ref={flatListRef}
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
    </Animated.View>
  );
};

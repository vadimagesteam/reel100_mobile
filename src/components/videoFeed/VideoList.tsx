import { FlashList, FlashListRef } from '@shopify/flash-list';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { FlatList, FlatListProps, RefreshControl, InteractionManager } from 'react-native';
import { useNavigation } from '../../navigation';
import { isAndroid } from '../../utils';

import { VideoPost } from './queries/apiVideosFetcher';
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
    if (videos[activeIndex]) {
      likeAnimationRef.current?.trigger(x, y); // show "Like" animation
      setTimeout(() => {
        // wait for the animation end (1 sec)
        like.mutate({
          type: 'video',
          id: videos[activeIndex].id,
          authorId: videos[activeIndex].user.id,
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

  const backSwipeGesture = Gesture.Pan()
    .enabled(isFullscreen)
    .activeOffsetX(10)
    .onStart(() => {
      runOnJS(setIsPaused)(true);
    })
    .onUpdate((e) => {
      swipeTranslateX.value = e.translationX;
      swipeTranslateY.value = e.translationY;
    })
    .onEnd((e) => {
      swipeTranslateX.value = withTiming(0);
      swipeTranslateY.value = withTiming(0);

      if (isFullscreen && e.translationX > 120 && (isAndroid || e.velocityX > 100)) {
        runOnJS(handleBackSwipe)();
      } else {
        runOnJS(setIsPaused)(false);
      }
    });

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
    .onEnd((e) => {
      runOnJS(handleDoubleTap)(e.x, e.y);
    });

  const renderItem = useCallback(
    ({ item: video, index }: { item: VideoPost; index: number }) => {
      return (
        <VideoListItem
          video={video}
          dimensions={dimensions}
          active={activeIndex === index}
          showTopRank={showTopRank}
        />
      );
    },
    [dimensions, activeIndex, showTopRank],
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

  const gesturesCombined = Gesture.Exclusive(backSwipeGesture, doubleTapGesture, singleTapGesture);
  const VideoBatchSize = 6;

  // flatListRef.current?.recomputeViewableItems();

  useEffect(() => {
    if (initialVideoIndex > -1) {
      flatListRef.current?.scrollToOffset({
        offset: initialVideoIndex * dimensions.height,
        animated: false,
      });
    }
  }, [dimensions.height, initialVideoIndex]);

  return (
    <Animated.View className="flex-1 overflow-hidden bg-background" style={viewStyle}>
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
          // estimatedItemSize={dimensions.height}
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={initialVideoIndex}
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
    </Animated.View>
  );
};

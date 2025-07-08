import { Text, View } from 'react-native';
import React, { FC, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, SvgIcon } from '../ui';
import { VideoPost } from './queries/apiVideosFetcher';
import { colors } from '../../styles';
import { cs } from '../old/VideoAbsoluteInfo/styles';
import { GestureTouchableOpacity } from './GestureTouchableOpacity';
import Animated, { runOnJS, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { IconHeart } from './IconHeart';
import { useVideoFeed } from './hooks';

export interface VideoInfoOverlayProps {
  isPlayerFullScreen: boolean;
  timeLeft?: string;
  rankNumber?: number;
  video: VideoPost;
  showComments?: boolean;
  showShare?: boolean;
  showLikes?: boolean;
  liked?: boolean;
  isPaused?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  onComments?: () => void;
  onUser?: () => void;
}

export const VideoInfoOverlay: FC<VideoInfoOverlayProps> = ({
  isPlayerFullScreen,
  isPaused,
  timeLeft,
  rankNumber,
  video,
  showComments,
  showShare,
  showLikes,
  onUser,
  onShare,
  onComments,
  onLike,
  liked,
}) => {
  const insets = useSafeAreaInsets();
  const { setHeartIconPos } = useVideoFeed((s) => s.actions);

  const {
    user: { firstName, lastName },
    likesCount,
    commentsCount,
  } = video;

  const wrapperViewRef = useRef<View>(null);
  const heartRef = useRef<View>(null);

  const updateIconPosition = () => {
    heartRef.current?.measureInWindow((x, y) => {
      console.log('👀 HEART POS', { x, y });
      // setHeartIconPos({ x, y });
    });
    heartRef.current?.measureLayout(
      wrapperViewRef.current!,
      (x, y) => {
        console.log('📌 Relative to custom parent:', { x, y });
        setHeartIconPos({ x, y });
      },
      () => {
        console.warn('Failed to measure heart icon layout position');
      },
    );
  };

  const topInfoStyles = useAnimatedStyle(
    () => ({
      top: withTiming(isPlayerFullScreen ? insets.top : 30, { duration: 300 }, () => {
        runOnJS(updateIconPosition)();
      }),
    }),
    [isPlayerFullScreen],
  );

  const bottomInfoStyles = useAnimatedStyle(
    () => ({
      bottom: withTiming(isPlayerFullScreen ? 110 : 80, { duration: 300 }),
    }),
    [isPlayerFullScreen],
  );

  return (
    <Animated.View
      ref={wrapperViewRef}
      className="absolute bottom-4 top-4 z-20 h-full w-full"
      style={topInfoStyles}
    >
      {isPaused && (
        <View className="absolute h-full w-full items-center justify-center opacity-50">
          <SvgIcon image="playIcon" color="white" style={cs.iconPlayStyle} />
        </View>
      )}

      <GestureTouchableOpacity
        className="absolute left-4 flex-row items-center gap-2"
        onPress={onUser}
        hitSlop={20}
      >
        <Avatar size={32} name={`${firstName} ${lastName}`} />
        <Text className="font-bold text-white">{`${firstName} ${lastName}`}</Text>
      </GestureTouchableOpacity>

      <View className="absolute right-4 flex-row">
        <View className="ml-1 rounded bg-orange p-1 opacity-80">
          <Text className="color-white">#{rankNumber}</Text>
        </View>
        {timeLeft && (
          <View className="ml-1 rounded bg-black5 p-1 opacity-80">
            <Text className="color-white">{timeLeft}</Text>
          </View>
        )}
      </View>

      <Animated.View className="absolute right-4 flex flex-col gap-6" style={bottomInfoStyles}>
        {showLikes && (
          <GestureTouchableOpacity
            onPress={onLike}
            hitSlop={20}
            className="flex-col items-center gap-2"
          >
            <View
              ref={heartRef}
              //onLayout={onHearIconLayout}
            >
              <IconHeart variant={liked ? 'filled' : 'outline'} width={24} height={24} />
            </View>
            <Text className="text-base font-bold color-white">{likesCount}</Text>
          </GestureTouchableOpacity>
        )}
        {showComments && (
          <GestureTouchableOpacity
            onPress={onComments}
            hitSlop={20}
            className="flex-col items-center gap-2"
          >
            <SvgIcon image="commentIcon" color={colors.white} style={cs.iconStyle24} />
            <Text className="text-base font-bold color-white">{commentsCount}</Text>
          </GestureTouchableOpacity>
        )}
        {showShare && (
          <GestureTouchableOpacity hitSlop={20} onPress={onShare}>
            <SvgIcon image="shareIcon" color={colors.white} style={cs.iconStyle24} />
          </GestureTouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

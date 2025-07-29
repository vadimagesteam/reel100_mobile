import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { getFullName } from '../../state/user/utils';
import { isAndroid } from '../../utils';
import { Avatar, Backdrop, SvgIcon } from '../ui';
import { VideoPost } from './queries/apiVideosFetcher';
import { colors } from '../../theme';
import { GestureTouchableOpacity } from './GestureTouchableOpacity';
import { IconHeart } from './IconHeart';
import { useVideoFeed } from './hooks';
import { VideoDescription } from './VideoDescription';

export interface VideoInfoOverlayProps {
  isPlayerFullScreen: boolean;
  timeLeft?: string | number;
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
  onBackPress?: () => void;
}

export const VideoInfoOverlay = ({
  onBackPress,
  isPlayerFullScreen,
  isPaused,
  timeLeft,
  video,
  showComments,
  showShare,
  showLikes,
  onUser,
  onShare,
  onComments,
  onLike,
  liked,
}: VideoInfoOverlayProps) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { setHeartIconPos } = useVideoFeed((s) => s.actions);

  const { user, likesCount, commentsCount } = video;

  const wrapperViewRef = useRef<View>(null);
  const heartRef = useRef<View>(null);

  const updateIconPosition = () => {
    heartRef.current?.measureLayout(
      wrapperViewRef.current!,
      (x, y) => {
        // console.log('📌 Relative to custom parent:', { x, y });
        setHeartIconPos({ x, y });
      },
      () => {
        console.warn('Failed to measure heart icon layout position');
      },
    );
  };

  const topInfoStyles = useAnimatedStyle(
    () => ({
      top: withTiming(isPlayerFullScreen ? insets.top : 12, { duration: 300 }, () => {
        runOnJS(updateIconPosition)();
      }),
    }),
    [isPlayerFullScreen],
  );

  const backdropActive = useSharedValue(false);
  const displayName = getFullName(user);

  return (
    <View ref={wrapperViewRef} className="absolute inset-0 z-20 h-full w-full">
      <Backdrop
        activeOpacity={0.6}
        onPress={() => {
          if (backdropActive.value) {
            backdropActive.value = false;
          }
        }}
        active={backdropActive}
      />
      <Animated.View
        style={topInfoStyles}
        className="absolute left-2 right-2 top-4 flex-row items-center justify-between"
      >
        {/* Top Left */}
        <View className="flex-row items-center gap-2">
          {isPlayerFullScreen && (
            <GestureTouchableOpacity
              className="flex-row items-center gap-2"
              onPress={onBackPress}
              hitSlop={10}
            >
              <Ionicons size={24} name="chevron-back" color="#fff" />
            </GestureTouchableOpacity>
          )}

          <GestureTouchableOpacity
            className="flex-row items-center gap-2"
            onPress={onUser}
            hitSlop={{ top: 10, right: 10, bottom: 10 }}
          >
            <Avatar size={32} uri={user.avatar} name={displayName} />
            <Text numberOfLines={1} className="max-w-[200px] font-bold text-primary">
              {displayName}
            </Text>
          </GestureTouchableOpacity>
        </View>

        {/* Top Right */}
        <View className="flex-row">
          {video.top_100Position !== null && (
            <View className="ml-1 rounded bg-orange p-1 opacity-80">
              <Text className="color-white">#{video.top_100Position}</Text>
            </View>
          )}

          {timeLeft !== undefined && (
            <View className="ml-1 w-[43px] p-1">
              <Text className="text-right text-[15px] font-bold color-white">{timeLeft}s</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {isPaused && (
        <View className="absolute h-full w-full items-center justify-center opacity-50">
          <SvgIcon image="playIcon" color="white" style={styles.playIcon} />
        </View>
      )}

      <Animated.View className="absolute bottom-[80px] right-4 z-[11] flex flex-col gap-6">
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
            <SvgIcon image="commentIcon" color={colors.white} style={styles.icon} />
            <Text className="text-base font-bold color-white">{commentsCount}</Text>
          </GestureTouchableOpacity>
        )}
        {showShare && (
          <GestureTouchableOpacity hitSlop={20} onPress={onShare}>
            <SvgIcon image="shareIcon" color={colors.white} style={styles.icon} />
          </GestureTouchableOpacity>
        )}
      </Animated.View>

      {video.description && (
        <VideoDescription
          backdropActive={backdropActive}
          text={video.description}
          bottomInset={route.name === Screens.VideoModal ? insets.bottom : isAndroid ? 18 : 12}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  playIcon: {
    width: 50,
    height: 50,
  },
});

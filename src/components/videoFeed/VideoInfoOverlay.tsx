import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../../state/user/authStore';
import { getDisplayName } from '../../state/user/utils';
import { formatNumberShort, formatNumberUS, isAndroid, isoUTCDateToLocate } from '../../utils';
import { Avatar, Backdrop, SvgIcon } from '../ui';
import { FollowButton } from '../user/FollowButton';
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
  allowDelete?: boolean;
  liked?: boolean;
  isPaused?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  onComments?: () => void;
  onUser?: () => void;
  onBackPress?: () => void;
  onDelete?: () => void;
  showTopRank?: boolean;
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
  allowDelete,
  onUser,
  onShare,
  onComments,
  onLike,
  onDelete,
  liked,
  showTopRank = true,
}: VideoInfoOverlayProps) => {
  const insets = useSafeAreaInsets();
  const { setHeartIconPos } = useVideoFeed((s) => s.actions);
  const screenType = useVideoFeed((s) => s.screenType);
  const showVideoDate = useVideoFeed((s) => s.showVideoDate);

  const me = useUser();

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

  const backdropActive = useSharedValue(false);
  const displayName = getDisplayName(user);

  const topInfoStyles = useAnimatedStyle(
    () => ({
      top: withTiming(isPlayerFullScreen ? insets.top : 12, { duration: 300 }, () => {
        runOnJS(updateIconPosition)();
      }),
    }),
    [isPlayerFullScreen],
  );

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: backdropActive.value ? 0 : 1,
  }));

  const itemsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(backdropActive.value ? 0 : 1, { duration: 100 }),
  }));

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
        <View className="min-w-[20px]">
          {isPlayerFullScreen && (
            <GestureTouchableOpacity
              className="flex-row items-center gap-2"
              onPress={onBackPress}
              hitSlop={10}
            >
              <Ionicons size={24} name="chevron-back" color="#fff" />
            </GestureTouchableOpacity>
          )}
        </View>

        {showVideoDate && video.top_100Date && (
          <View>
            <Text className="text-xl font-medium text-primary">
              {isoUTCDateToLocate(video.top_100Date)}
            </Text>
          </View>
        )}

        {/* Top Right */}
        <View className="flex-row">
          {allowDelete && (
            <GestureTouchableOpacity
              onPress={onDelete}
              hitSlop={20}
              className="flex-col items-center gap-2"
            >
              <Ionicons name="trash-bin-outline" size={25} color={colors.red} />
            </GestureTouchableOpacity>
          )}

          {showTopRank && video.top_100Position !== null && (
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

      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="absolute bottom-[22px] z-[20] w-full flex-col gap-y-[12px] px-[12px]"
        style={screenType === 'modal' ? { bottom: insets.bottom } : undefined}
      >
        <Animated.View style={itemsStyle} className="flex-row">
          <View className="h-[35px] flex-[3] overflow-hidden">
            <GestureTouchableOpacity
              className="flex-row items-center gap-2"
              onPress={onUser}
              hitSlop={{ top: 10, right: 10, bottom: 10 }}
            >
              <Avatar size={35} uri={user.avatar} name={displayName} />
              <Text numberOfLines={1} className="max-w-[100px] font-bold text-primary">
                {displayName}
              </Text>
            </GestureTouchableOpacity>
          </View>
          <View className="flex-[2] items-center justify-center rounded-[10px] border-[2px] border-white">
            {showLikes && (
              <GestureTouchableOpacity
                onPress={onLike}
                hitSlop={20}
                className="flex-row items-center gap-2"
              >
                <View ref={heartRef}>
                  <IconHeart variant={liked ? 'filled' : 'outline'} width={24} height={24} />
                </View>
                <Text className="text-[16px] font-bold color-white">
                  {formatNumberUS(likesCount)}
                </Text>
              </GestureTouchableOpacity>
            )}
          </View>
          <View className="flex-[3] flex-row items-center justify-end gap-[24px]">
            {showComments && (
              <GestureTouchableOpacity
                onPress={onComments}
                hitSlop={20}
                className="w-[60px] flex-row items-center gap-2"
              >
                <SvgIcon image="commentIcon" color={colors.white} style={styles.icon} />
                <Text className="text-base font-bold color-white">
                  {formatNumberShort(commentsCount)}
                </Text>
              </GestureTouchableOpacity>
            )}
            {showShare && (
              <GestureTouchableOpacity hitSlop={20} onPress={onShare}>
                <SvgIcon image="shareIcon" color={colors.white} style={styles.icon} />
              </GestureTouchableOpacity>
            )}
          </View>
        </Animated.View>

        <View className="flex-row items-start gap-[10px]">
          {me.id !== user.id && (
            <FollowButton
              user={user}
              renderButton={({ followUnfollowAction, isLoading, text }) => (
                <GestureTouchableOpacity
                  onPress={followUnfollowAction}
                  disabled={isLoading}
                  style={buttonStyle}
                  className="rounded-[4px] bg-[#d9d9d9] px-[7px] py-[5px]"
                >
                  <Text className="text-[14px] font-bold color-[#0D0D0D]">{text}</Text>
                </GestureTouchableOpacity>
              )}
            />
          )}

          {video.description && (
            <VideoDescription
              backdropActive={backdropActive}
              text={video.description}
              bottomInset={isAndroid ? 14 : 8}
            />
          )}
        </View>
      </Animated.View>
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

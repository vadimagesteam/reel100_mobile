import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Video, {
  VideoRef,
  ReactVideoProps,
  ResizeMode,
  SelectedVideoTrackType,
  type OnLoadData,
  type OnProgressData,
} from 'react-native-video';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { VideoPost } from './queries/apiVideosFetcher.ts';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { colors } from '../../theme/colors.ts';
import { VideoPreview } from './VideoPreview';
import { formatTime } from '../../utils/formatTime.ts';
import { VideoInfoOverlay } from './VideoInfoOverlay';
import {
  useLikeMutations,
  useVideoLikeQuery,
  useVideoFullscreen,
  useVideoPause,
  useVideoFeed,
  useVideoShare,
} from './hooks';
import { Screens, Tabs } from '../../navigation/screens.ts';
import { useUser } from '../../state/user/authStore.ts';

export interface VideoItemProps extends Pick<ReactVideoProps, 'muted' | 'repeat'> {
  video: VideoPost;
  active: boolean;
  dimensions: { width: number; height: number };
  showImagePreview?: boolean;
  rankNumber?: number;
}

export const VideoListItem: FC<VideoItemProps> = ({
  video,
  muted,
  active,
  dimensions,
  showImagePreview,
  rankNumber,
  ...videoProps
}) => {
  const { id: videoId, file, user: author } = video;

  const user = useUser();
  const navigation = useNavigation<any>();
  const { isFullscreen } = useVideoFullscreen();
  const { isPaused, setIsPaused } = useVideoPause();
  const { shareVideo } = useVideoShare();

  const { openComments } = useVideoFeed((s) => s.actions);

  const playerRef = useRef<VideoRef>(null);

  const [loadStarted, setLoadStarted] = useState<OnLoadData>();
  const [progress, setProgress] = useState<OnProgressData>();

  const { data: likeData } = useVideoLikeQuery('video', videoId);
  const { toggleLike } = useLikeMutations();

  useFocusEffect(
    useCallback(() => {
      if (active) {
        setIsPaused(false);
      }
      return () => {
        setIsPaused(true);
      };
    }, [active, setIsPaused]),
  );

  // Get preview image (first video "screen")
  let videoUrl: string | null = null;
  let previewUrl: string | null = null;

  if (file) {
    const { variation } = file;
    videoUrl = file.hlsUrl ?? file.storagePath;
    previewUrl = variation?.[0]?.screenshots[0] ?? null;
  }

  // Reset to video start when video became inactive
  useEffect(() => {
    if (!active && playerRef.current) {
      playerRef.current.seek(0);
    }
  }, [active]);

  const mountRef = useRef(false);
  useEffect(() => {
    if (!mountRef.current && active && progress?.currentTime && playerRef.current) {
      playerRef.current.seek(progress.currentTime);
      mountRef.current = true;
    }
  }, [active, progress?.currentTime]);

  const handleLike = () => {
    toggleLike({
      type: 'video',
      id: videoId,
    });
  };

  return (
    <Pressable style={dimensions}>
      <Video
        ref={playerRef}
        repeat
        source={{ uri: videoUrl!, shouldCache: true }}
        paused={!active || isPaused || isPaused}
        resizeMode={ResizeMode.COVER}
        muted={muted || !active}
        onLoad={setLoadStarted}
        onProgress={setProgress}
        style={[dimensions]}
        selectedVideoTrack={{ type: SelectedVideoTrackType.AUTO }}
        // https://github.com/mrousavy/react-native-vision-camera/issues/3524
        disableAudioSessionManagement
        {...videoProps}
      />

      {active && (
        <VideoInfoOverlay
          video={video}
          isPlayerFullScreen={isFullscreen}
          isPaused={isPaused}
          timeLeft={
            loadStarted && progress
              ? formatTime(Math.round(loadStarted?.duration - progress?.currentTime))
              : undefined
          }
          rankNumber={rankNumber}
          showComments
          showShare
          showLikes
          liked={!!likeData?.id}
          onLike={handleLike}
          onShare={() => shareVideo(video.id)}
          onUser={() => {
            if (user.id === author.id) {
              navigation.navigate(Tabs.TabProfile);
            } else {
              navigation.navigate(Screens.OtherUserProfile, {
                user: author,
              });
            }
          }}
          onComments={() => openComments(video.id, video.user.id)}
        />
      )}
      {!loadStarted && showImagePreview && previewUrl && (
        <>
          <VideoPreview
            blur={Platform.select({ ios: true })}
            imageUrl={previewUrl}
            {...dimensions}
          />
          <View className="absolute left-0 top-0 z-10 h-full w-full items-center justify-center">
            <ActivityIndicator size="large" color={colors.blue2} />
          </View>
        </>
      )}
    </Pressable>
  );
};

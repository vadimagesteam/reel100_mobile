import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import Video, {
  type OnLoadData,
  type OnProgressData,
  ReactVideoProps,
  ResizeMode,
  SelectedVideoTrackType,
  VideoRef,
  ViewType,
} from 'react-native-video';
import { Screens, Tabs } from '../../navigation/screens';
import { useUser } from '../../state/user/authStore';
import { colors } from '../../theme/colors';
import { isAndroid } from '../../utils';
import { formatTime } from '../../utils/formatTime';
import {
  useLikeMutations,
  useVideoFeed,
  useVideoFullscreen,
  useVideoLikeQuery,
  useVideoPause,
  useVideoShare,
} from './hooks';
import { VideoPost } from './queries/apiVideosFetcher';
import { VideoInfoOverlay } from './VideoInfoOverlay';
import { VideoPreview } from './VideoPreview';

export interface VideoItemProps extends Pick<ReactVideoProps, 'muted' | 'repeat'> {
  video: VideoPost;
  active: boolean;
  dimensions: { width: number; height: number };
  rankNumber?: number;
}

export const VideoListItem: FC<VideoItemProps> = ({
  video,
  muted,
  active,
  dimensions,
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

    // Android: HLS file suddenly zooms in after first play, while .mp4 works just fine
    // https://github.com/TheWidlarzGroup/react-native-video/issues/2909
    if (isAndroid && variation.length) {
      videoUrl = variation[variation.length - 1].path;
    }
  }

  // Reset to video start when video became inactive
  useEffect(() => {
    if (!active && playerRef.current) {
      playerRef.current.seek(0);
    }
  }, [active]);

  // const mountRef = useRef(false);
  // useEffect(() => {
  //   if (!mountRef.current && active && progress?.currentTime && playerRef.current) {
  //     playerRef.current.seek(progress.currentTime);
  //     mountRef.current = true;
  //   }
  // }, [active, progress?.currentTime]);

  const handleLike = () => {
    toggleLike({
      type: 'video',
      id: videoId,
    });
  };

  return (
    <View style={dimensions}>
      <Video
        ref={playerRef}
        repeat={active}
        viewType={isAndroid ? ViewType.SURFACE : undefined}
        disableFocus={isAndroid}
        onEnd={() => {
          playerRef.current?.seek(0);
        }}
        source={{ uri: videoUrl!, shouldCache: true }}
        paused={!active || isPaused || isPaused}
        resizeMode={ResizeMode.COVER}
        muted={muted || !active}
        onLoad={setLoadStarted}
        onProgress={setProgress}
        style={[dimensions]}
        renderLoader={() => (
          <View className="flex-1">
            <VideoPreview
              blur={Platform.select({ ios: true })}
              imageUrl={previewUrl!}
              {...dimensions}
            />
            <View className="absolute left-0 top-0 z-10 h-full w-full items-center justify-center">
              <ActivityIndicator size="large" color={colors.blue2} />
            </View>
          </View>
        )}
        selectedVideoTrack={{ type: SelectedVideoTrackType.AUTO }}
        preventsDisplaySleepDuringVideoPlayback
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
            navigation.navigate(Screens.Profile, {
              user: author,
            });
          }}
          onComments={() => openComments(video.id, video.user.id)}
        />
      )}
    </View>
  );
};

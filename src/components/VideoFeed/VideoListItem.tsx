import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Video, {
  VideoRef,
  ReactVideoProps,
  ResizeMode,
  SelectedVideoTrackType,
  type OnLoadData,
  type OnProgressData,
} from 'react-native-video';
import Share from 'react-native-share';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { VideoPost } from './queries/apiVideosFetcher.ts';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { colors } from '../../theme/colors.ts';
import { VideoPreview } from './VideoPreview.tsx';
import { formatTime } from '../../utils/formatTime.ts';
import { VideoInfoOverlay } from './VideoInfoOverlay.tsx';
import {
  useLikeMutations,
  useVideoLikeQuery,
  useVideoFullscreen,
  useVideoPause,
  useVideoFeed,
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
  const {
    id: videoId,
    file: {
      hlsUrl,
      variation: [variation],
      storagePath,
    },
    user: author,
  } = video;

  const user = useUser();
  const navigation = useNavigation<any>();
  const { isFullscreen } = useVideoFullscreen();
  const { isPaused, setIsPaused } = useVideoPause();

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
  const previewUrl = variation ? variation.screenshots[0] : null;

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

  const openShare = useCallback(async () => {
    if (!storagePath) {
      console.warn('URL video not available');
      return;
    }
    let shareUrl = storagePath;
    if (
      !shareUrl.startsWith('http://') &&
      !shareUrl.startsWith('https://') &&
      !shareUrl.startsWith('file://')
    ) {
      shareUrl = 'file://' + shareUrl;
    }
    const options = {
      url: shareUrl,
      failOnCancel: false,
    };
    try {
      await Share.open(options);
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [storagePath]);

  return (
    <Pressable style={dimensions}>
      <Video
        ref={playerRef}
        repeat
        source={{ uri: hlsUrl, shouldCache: true }}
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
          onShare={openShare}
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
          <VideoPreview blur imageUrl={previewUrl} {...dimensions} />
          <View className="absolute left-0 top-0 z-10 h-full w-full items-center justify-center">
            <ActivityIndicator size="large" color={colors.blue2} />
          </View>
        </>
      )}
    </Pressable>
  );
};

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Video, {
  VideoRef,
  ReactVideoProps,
  ResizeMode,
  SelectedVideoTrackType,
} from 'react-native-video';
import { VideoPost } from './queries/apiVideosFetcher.ts';
import { ActivityIndicator, View } from 'react-native';
import { OnLoadData } from 'react-native-video/src/types/events.ts';
import { colors } from '../../theme/colors.ts';
import { VideoPreview } from './VideoPreview.tsx';
import type { OnProgressData } from 'react-native-video/src/specs/VideoNativeComponent.ts';
import { formatTime } from '../../utils/formatTime.ts';
import {
  useVideoActions,
  useVideoPlayerStore,
} from '../../state/videoPlayer/videoVideoPlayerStore.ts';
import { VideoInfoOverlay } from './VideoInfoOverlay.tsx';
import { useVideoLikeQuery } from './queries/useLikeQuery.ts';
import { useLikeMutations } from './queries/useLikeMutations.ts';
import Share from 'react-native-share';

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
  } = video;

  const isPlayerFullScreen = useVideoPlayerStore((s) => s.isPlayerFullScreen);
  const isPaused = useVideoPlayerStore((s) => s.isPaused);
  const currentTime = useVideoPlayerStore((s) => s.currentTime);

  const { openComments, updateTime } = useVideoActions();

  const playerRef = useRef<VideoRef>(null);

  const [loadStarted, setLoadStarted] = useState<OnLoadData>();
  const [progress, setProgress] = useState<OnProgressData>();

  const { data: likeData } = useVideoLikeQuery('video', videoId);

  const { toggleLike } = useLikeMutations();

  // Get preview image (first video "screen")
  const previewUrl = variation ? variation.screenshots[0] : null;

  // Reset to video start when video became inactive
  useEffect(() => {
    if (!active && playerRef.current) {
      playerRef.current.seek(0);
    }
  }, [active, currentTime]);

  const mountRef = useRef(false);
  useEffect(() => {
    if (!mountRef.current && active && currentTime && playerRef.current) {
      playerRef.current.seek(currentTime);
      mountRef.current = true;
    }
  }, [active, currentTime]);

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
    <View style={dimensions}>
      <Video
        ref={playerRef}
        repeat
        source={{ uri: hlsUrl, shouldCache: true }}
        paused={!active || isPaused}
        resizeMode={ResizeMode.COVER}
        muted={muted || !active}
        onLoad={setLoadStarted}
        onProgress={(progress: OnProgressData) => {
          setProgress(progress);
          updateTime(progress.currentTime);
        }}
        style={[dimensions]}
        selectedVideoTrack={{ type: SelectedVideoTrackType.AUTO }}
        {...videoProps}
      />

      {active && (
        <VideoInfoOverlay
          video={video}
          isPlayerFullScreen={isPlayerFullScreen}
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
          onUser={() => {}}
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
    </View>
  );
};

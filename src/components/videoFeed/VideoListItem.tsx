import { useFocusEffect } from '@react-navigation/native';
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import Video, {
  type OnLoadData,
  type OnProgressData,
  ReactVideoProps,
  ResizeMode,
  SelectedVideoTrackType,
  VideoRef,
  ViewType,
} from 'react-native-video';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { isAndroid } from '../../utils';
import {
  useDeleteMutation,
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
  showTopRank?: boolean;
}

export const VideoListItemRaw: FC<VideoItemProps> = ({
  video,
  muted,
  active,
  dimensions,
  showTopRank = true,
  ...videoProps
}) => {
  const { id: videoId, file, user: author } = video;

  const navigation = useNavigation();
  const { isFullscreen, setFullscreen } = useVideoFullscreen();
  const { isPaused, setIsPaused } = useVideoPause();
  const { shareVideo } = useVideoShare();

  const allowDelete = useVideoFeed((s) => s.allowDelete);
  const backPressHandler = useVideoFeed((s) => s.backPressHandler);
  const { openComments } = useVideoFeed((s) => s.actions);

  const playerRef = useRef<VideoRef>(null);

  const [loadStarted, setLoadStarted] = useState<OnLoadData>();
  const [progress, setProgress] = useState<OnProgressData>();

  const { data: likeData } = useVideoLikeQuery('video', videoId);
  const { toggleLike } = useLikeMutations();
  const { mutate: deleteVideo } = useDeleteMutation();

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

  const handleLike = () => {
    toggleLike({
      type: 'video',
      id: videoId,
      authorId: video.user.id,
    });
  };

  const handleDelete = () => {
    Alert.alert('Delete this video?', 'This action cannot be undone', [
      {
        style: 'cancel',
        text: 'Cancel',
      },
      {
        style: 'destructive',
        text: 'Delete',
        onPress: async () => {
          deleteVideo({
            id: videoId,
          });
          setFullscreen(false);
          if (backPressHandler) {
            backPressHandler();
          }
        },
      },
    ]);
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
        muted={!isFullscreen || muted || !active}
        onLoad={setLoadStarted}
        onProgress={setProgress}
        style={[dimensions]}
        renderLoader={() => (
          <VideoPreview
            blur={Platform.select({ ios: true })}
            imageUrl={previewUrl!}
            {...dimensions}
          />
        )}
        selectedVideoTrack={{ type: SelectedVideoTrackType.AUTO }}
        preventsDisplaySleepDuringVideoPlayback
        // https://github.com/mrousavy/react-native-vision-camera/issues/3524
        disableAudioSessionManagement
        {...videoProps}
      />
      {active && (
        <VideoInfoOverlay
          showTopRank={showTopRank}
          video={video}
          onBackPress={() => {
            if (backPressHandler) {
              backPressHandler();
            } else {
              setFullscreen(false);
            }
          }}
          isPlayerFullScreen={isFullscreen}
          isPaused={isPaused}
          timeLeft={
            loadStarted && progress
              ? Math.round(loadStarted?.duration - progress?.currentTime)
              : file?.duration
                ? Math.round(file.duration / 1000)
                : '0'
          }
          showComments
          showShare
          showLikes
          allowDelete={allowDelete}
          onDelete={handleDelete}
          liked={!!likeData?.id}
          onLike={handleLike}
          onShare={() => shareVideo(video.id)}
          onUser={() => {
            navigation.navigate(Screens.Profile, { user: author });
          }}
          onComments={() => openComments(video.id)}
        />
      )}
    </View>
  );
};

export const VideoListItem = memo(
  VideoListItemRaw,
  (prev, next) =>
    prev.video === next.video && prev.active === next.active && prev.dimensions === next.dimensions,
);

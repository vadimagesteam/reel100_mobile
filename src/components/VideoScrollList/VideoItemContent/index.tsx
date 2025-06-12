import React, { memo, ReactNode, useEffect, useMemo, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Video, {
  OnBandwidthUpdateData,
  OnPlaybackStateChangedData,
  OnVideoAspectRatioData,
  OnVideoErrorData,
  OnVideoTracksData,
  ResizeMode,
  SelectedVideoTrackType,
} from 'react-native-video';
import { GestureDetector } from 'react-native-gesture-handler';
import { VideoItemType } from '../../../redux/CameraRedux/types';
import { cs } from './styles';

type VideoItemContentProps = {
  item: VideoItemType;
  isActive: boolean;
  videoHeight?: number;
  onLoad: (data: { duration: number }) => void;
  onProgress: (data: { currentTime: number }) => void;
  gesture: any;
  muted?: boolean;
  /**
   * IMPORTANT: renderOverlay should be memoized in the parent (useCallback/useMemo).
   */
  renderOverlay: () => ReactNode;
  videoStyle?: StyleProp<ViewStyle>;
  paused?: boolean;
  setPaused?: (val: boolean) => void;
};

// Custom equality check for React.memo to avoid re-render when renderOverlay reference is the same
function areEqual(prevProps: VideoItemContentProps, nextProps: VideoItemContentProps) {
  return (
    prevProps.item === nextProps.item &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.videoHeight === nextProps.videoHeight &&
    prevProps.paused === nextProps.paused &&
    prevProps.muted === nextProps.muted &&
    prevProps.gesture === nextProps.gesture &&
    prevProps.videoStyle === nextProps.videoStyle &&
    prevProps.onLoad === nextProps.onLoad &&
    prevProps.onProgress === nextProps.onProgress &&
    prevProps.renderOverlay === nextProps.renderOverlay // Only rerender if reference changes
  );
}

const VideoItemContent = ({
                            item,
                            isActive,
                            videoHeight,
                            onLoad,
                            onProgress,
                            gesture,
                            muted = false,
                            renderOverlay,
                            videoStyle,
                            paused,
                          }: VideoItemContentProps) => {
  const videoRef = useRef<Video>(null);

  // Seek to the beginning when isActive toggles true
  useEffect(() => {
    if (isActive && videoRef.current) {
      const timeout = setTimeout(() => {
        videoRef.current?.seek?.(0);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  // Use video URL from item.file if present, fallback otherwise
  const videoUrl = useMemo(() => {
    if (item.file?.hlsUrl) return item.file.hlsUrl;
    // fallback to a default HLS link if needed
    return 'https://pub-86d004e530e24e33aa2e42c9a33d4f13.r2.dev/storage/cm7ji880s0000usjwpiex9pq4/cmbrwg5xo0000uskp4askbbq5/hls/main.m3u8';
  }, [item]);

  // Memoize overlay to avoid unnecessary re-renders if the reference is stable
  const overlay = useMemo(() => renderOverlay(), [renderOverlay]);

  // Side-effect/console logging should be removed in production!
  // console.log('VideoItem: ', item);

  return (
    <View
      style={[cs.container, videoHeight ? { height: videoHeight } : null, videoStyle]}
      collapsable={false}
    >
      <GestureDetector gesture={gesture}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          paused={!isActive || !!paused}
          resizeMode={ResizeMode.CONTAIN}
          repeat
          muted={muted}
          onLoad={onLoad}
          onProgress={onProgress}
          style={[{ height: videoHeight }, cs.width100, videoStyle]}
          selectedVideoTrack={{ type: SelectedVideoTrackType.AUTO }}
          onVideoTracks={(data: OnVideoTracksData) => {
            // console.log('onVideoTracks', data.videoTracks);
          }}
          onError={(err: OnVideoErrorData) => {
            // console.error(JSON.stringify(err));
          }}
          onAspectRatio={(data: OnVideoAspectRatioData) => {
            // console.log('onAspectRadio called ' + JSON.stringify(data));
          }}
          onPlaybackStateChanged={(data: OnPlaybackStateChangedData) => {
            // console.log('onPlaybackStateChanged', data);
          }}
          onBandwidthUpdate={(data: OnBandwidthUpdateData) => {
            // console.log('onVideoBandwidthUpdate', data);
          }}
        />
      </GestureDetector>
      {overlay}
    </View>
  );
};

export default memo(VideoItemContent, areEqual);
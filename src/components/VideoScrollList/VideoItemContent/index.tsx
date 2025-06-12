import React, { ReactNode, useEffect, useRef, memo, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Video from 'react-native-video';
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
  renderOverlay: () => ReactNode;
  videoStyle?: StyleProp<ViewStyle>;
  paused?: boolean;
  setPaused?: (val: boolean) => void;
};

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

  // Memoize the overlay to avoid unnecessary re-renders
  const overlay = useMemo(() => renderOverlay(), [renderOverlay]);

  console.log('VideoItem: ', item);

  return (
    <View style={[cs.container, videoHeight ? { height: videoHeight } : null, videoStyle]}>
      <GestureDetector gesture={gesture}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          paused={!isActive || !!paused}
          resizeMode="cover"
          repeat
          muted={muted}
          onLoad={onLoad}
          onProgress={onProgress}
          style={[{ height: videoHeight }, cs.width100, videoStyle]}
        />
      </GestureDetector>
      {overlay}
    </View>
  );
};

export default memo(VideoItemContent);
import Video, {
  OnBandwidthUpdateData,
  OnPlaybackStateChangedData,
  OnVideoAspectRatioData,
  OnVideoErrorData,
  OnVideoTracksData,
  ResizeMode,
  SelectedVideoTrackType,
} from 'react-native-video';
import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { VideoPost } from '../../components/VideoFeed/queries/apiVideosFetcher.ts';
import { Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export function TestVideoFullScreen() {
  const { params } = useRoute<any>();

  const [read, setReady] = useState(false);

  const videoRef = useRef(null);
  const video = params.video as VideoPost;
  const startTime = params.timeStart as number;

  return (
    <View className="flex-1 bg-fuchsia-200">
      <Video
        ref={videoRef}
        source={{ uri: video.file.hlsUrl }}
        paused={false}
        resizeMode={ResizeMode.COVER}
        repeat
        muted={false}
        onLoad={(data) => {
          if (videoRef.current && startTime > 0) {
            console.log('------ SET TIME????????', {
              ref: videoRef.current,
              startTime,
            });
            videoRef.current.seek(startTime);
          }
        }}
        // onProgress={(data) => {
        //   console.log('progress', data);
        // }}
        style={[{ width, height }]}
        selectedVideoTrack={{ type: SelectedVideoTrackType.AUTO }}
        onVideoTracks={(data: OnVideoTracksData) => {
          console.log('onVideoTracks', data.videoTracks);
        }}
        onError={(err: OnVideoErrorData) => {
          console.error(JSON.stringify(err));
        }}
        onAspectRatio={(data: OnVideoAspectRatioData) => {
          console.log('onAspectRadio called ' + JSON.stringify(data));
        }}
        onPlaybackStateChanged={(data: OnPlaybackStateChangedData) => {
          console.log('onPlaybackStateChanged', data);
        }}
        onBandwidthUpdate={(data: OnBandwidthUpdateData) => {
          console.log('onVideoBandwidthUpdate', data);
        }}
      />
    </View>
  );
}

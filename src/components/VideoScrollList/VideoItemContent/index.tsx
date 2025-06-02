import React, { ReactNode, useEffect, useRef } from 'react';
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
    muted?: boolean
    renderOverlay: () => ReactNode;
    videoStyle?: StyleProp<ViewStyle>
    paused?: boolean
    setPaused?: (val: boolean) => void
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
    const videoRef = useRef<any>(null);

    useEffect(() => {
        if (isActive && videoRef.current) {
            const timeout = setTimeout(() => {
                videoRef.current.seek(0);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [isActive]);

    return (
        <GestureDetector gesture={gesture}>
            <View style={[cs.container, { height: videoHeight }, videoStyle]}>
                <Video
                    ref={videoRef}
                    source={{ uri: item.file?.storagePath }}
                    paused={!isActive || paused}
                    resizeMode="cover"
                    repeat
                    muted={muted}
                    onLoad={onLoad}
                    onProgress={onProgress}
                    style={[{ height: videoHeight }, cs.width100, videoStyle]}
                />
                {renderOverlay()}
            </View>
        </GestureDetector>
    );
};

export default VideoItemContent;

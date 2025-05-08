import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import { HandlerStateChangeEvent, TapGestureHandler, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { positionHelpers } from '../../../../../../styles';
import { cs } from './styles';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';

interface VideoItemProps {
    source: string;
    isActive: boolean
    videoHeight: number
    // tapPosition: { x: number, y: number };
    tapX: number
    tapY: number
    scale: Animated.SharedValue<number>;
    opacity: Animated.SharedValue<number>;
    handleSingleTap: (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void;
    handleDoubleTap: (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void;

    avatar: string;
    name: string;
    videoNumber: number;
    videoDuration: string | number;
    onVideoLoad: (duration: number) => void;
    likesCount: number;

    onVideoRepeat?: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({
    source,
    isActive = false,
    videoHeight,
    tapX,
    tapY,
    scale,
    opacity,
    handleSingleTap,
    handleDoubleTap,
    avatar,
    name,
    videoNumber,
    videoDuration,
    onVideoLoad,
    likesCount,
    onVideoRepeat }) => {
    const videoRef = useRef<any | null>(null);
    const doubleTapRef = useRef<TapGestureHandler>(null);

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.seek(0);
        }
    }, [isActive]);

    // Animated style heart
    const animatedStyle = useAnimatedStyle(() => ({
        // position: 'absolute',
        left: tapX.value - 40,
        top: tapY.value - 40,
        // left: tapPosition.x,
        // top: tapPosition.y,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));


    return (
        <View style={positionHelpers.fill}>
            <TapGestureHandler
                onHandlerStateChange={handleSingleTap}
                waitFor={doubleTapRef}>
                <TapGestureHandler
                    onHandlerStateChange={handleDoubleTap}
                    numberOfTaps={2}
                    ref={doubleTapRef}>
                    <View style={[positionHelpers.center, cs.videoWrapper]}>
                        <Video
                            ref={videoRef}
                            source={{ uri: source }}
                            style={[
                                cs.video,
                                { height: videoHeight },
                            ]}
                            resizeMode="cover"
                            repeat
                            muted
                            paused={!isActive}
                            onLoad={(data) => {
                                onVideoLoad(Math.floor(data.duration));
                            }}
                            onEnd={() => {
                                videoRef.current?.seek(0);
                                onVideoRepeat?.();
                            }}
                        />
                    </View>
                </TapGestureHandler>
            </TapGestureHandler>
            <VideoAbsoluteInfo
                avatar={avatar}
                name={name}
                videoNumber={videoNumber}
                videoDuration={videoDuration}
                likesCount={likesCount}
            />

            {/* Heart animation */}
            <Animated.Text style={[cs.heart, animatedStyle]}>❤️</Animated.Text>
        </View>
    );
};

export default VideoItem;

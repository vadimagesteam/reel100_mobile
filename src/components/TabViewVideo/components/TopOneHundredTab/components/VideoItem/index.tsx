import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { positionHelpers } from '../../../../../../styles';
import { cs } from './styles';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';

interface VideoItemProps {
    source: string;
    isActive: boolean
    videoHeight: number
    tapX: SharedValue<number>
    tapY: SharedValue<number>
    scale: SharedValue<number>
    opacity: SharedValue<number>
    onSingleTap?: (e: any) => void;
    onDoubleTap?: (e: any) => void;

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
    onSingleTap,
    onDoubleTap,
    avatar,
    name,
    videoNumber,
    videoDuration,
    onVideoLoad,
    likesCount,
    onVideoRepeat }) => {
    const videoRef = useRef<any | null>(null);
    // const doubleTapRef = useRef<TapGestureHandler>(null);

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


    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((e) => {
            if (!e) { return; }

            tapX.value = e.x;
            tapY.value = e.y;

            scale.value = 1;
            opacity.value = 1;

            scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
                scale.value = withTiming(0, { duration: 500 });
                opacity.value = withTiming(0, { duration: 500 });
            });

            onDoubleTap?.();
        });

    const singleTap = Gesture.Tap()
        .numberOfTaps(1)
        .onEnd(() => {
            onSingleTap?.();
        });
    // .requireFailure(doubleTap);

    const gesture = Gesture.Exclusive(doubleTap, singleTap);


    return (
        <GestureDetector gesture={gesture}>
            <View style={positionHelpers.fill}>
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
        </GestureDetector>
    );
};

export default VideoItem;

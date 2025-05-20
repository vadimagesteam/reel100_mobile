import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import Video from 'react-native-video';
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { getVideoCommentsAction } from '../../../redux/VideoRedux/videoAction';
import { colors, positionHelpers } from '../../../styles';
import VideoAbsoluteInfo from '../../VideoAbsoluteInfo';
import { formatTime } from '../../../utils/formatTime';
import CommentSection from '../../CommentSection';


interface FullVideoModalProps {
    onArrowPress?: () => void
}

const FullVideoModal = ({
    onArrowPress,
}: FullVideoModalProps) => {
    const dispatch = useReduxDispatch();
    const { modalVideoVisible } = useReduxSelector((state: RootState) => state?.modals);
    const { countComments, oneVideoData } = useReduxSelector((state: RootState) => state.video);
    const videoRef = useRef<any | null>(null);
    const doubleTapRef = useRef<TapGestureHandler>(null);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [durationReady, setDurationReady] = useState(false);

    const [showComments, setShowComments] = useState(false);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    console.log('oneVideoData--->', oneVideoData);

    useEffect(() => {
        if (oneVideoData && oneVideoData?.id) {
            dispatch(getVideoCommentsAction(oneVideoData.id));
            setIsVideoReady(false);
            setDurationReady(false);
        }
    }, [oneVideoData?.id]);

    // console.log('modalVideo-->', modalVideo);

    const handleDoubleTap = useCallback(
        (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
            if (event.nativeEvent.state === State.END) {
                const { x, y } = event.nativeEvent;

                tapX.value = x;
                tapY.value = y;

                scale.value = 1;
                opacity.value = 1;

                scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
                    scale.value = withTiming(0, { duration: 500 });
                    opacity.value = withTiming(0, { duration: 500 });
                });
            }
        },
        [scale, opacity, tapX, tapY]
    );


    //Save duration video
    const handleVideoLoadModal = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
        setRemainingSeconds(prev => ({ ...prev, [id]: duration }));
        setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
        setIsVideoReady(true);

    }, []);

    //Repeat duration video
    const onVideoRepeat = useCallback((id: string) => {
        const duration = durations[id];
        if (duration) {
            setRemainingSeconds(prev => ({
                ...prev,
                [id]: Math.floor(duration),
            }));
            setVideoStartTimes(prev => ({
                ...prev,
                [id]: 0,
            }));
        }
    }, [durations]);

    // Animated style heart
    const animatedStyle = useAnimatedStyle(() => ({
        left: tapX.value - 40,
        top: tapY.value - 40,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const openComments = () => {
        setShowComments(true);
    };

    return (
        <Modal visible={modalVideoVisible} transparent={false} animationType="fade">
            <TapGestureHandler
                onHandlerStateChange={handleDoubleTap}
                numberOfTaps={2}
                ref={doubleTapRef}>
                <View
                    style={[positionHelpers.fill, { backgroundColor: colors.black }]}

                >
                    {oneVideoData && (
                        <>
                            <Video
                                ref={videoRef}
                                source={{ uri: oneVideoData?.file?.storagePath }}
                                style={positionHelpers.fill}
                                resizeMode="cover"
                                muted={false}
                                repeat
                                paused={false}
                                controls={false}
                                onLoad={(data) => {
                                    handleVideoLoadModal(oneVideoData?.id, data?.duration);
                                }}
                                onProgress={({ currentTime }) => {
                                    if (oneVideoData?.id && durations[oneVideoData.id]) {
                                        const duration = durations[oneVideoData.id];
                                        setRemainingSeconds(prev => {
                                            const newRemaining = duration - currentTime;
                                            if (Math.abs((prev[oneVideoData.id] ?? 0) - newRemaining) > 0.25) {
                                                return {
                                                    ...prev,
                                                    [oneVideoData.id]: newRemaining,
                                                };
                                            }
                                            return prev;
                                        });

                                        if (currentTime >= duration) {
                                            videoRef.current?.seek(0);
                                            onVideoRepeat(oneVideoData.id);
                                        }
                                    }
                                }}
                            // onEnd={() => {
                            //     videoRef.current?.seek(0);
                            //     onVideoRepeat(oneVideoData?.id);
                            // }}
                            />
                            <VideoAbsoluteInfo
                                videoCheck={'FULL'}
                                showArrow={true}
                                onArrowBack={onArrowPress}
                                avatar={oneVideoData?.avatar}
                                name={oneVideoData?.fullname}
                                likesCount={oneVideoData?.like_count}
                                videoDuration={formatTime(oneVideoData ? remainingSeconds[oneVideoData.id] ?? 0 : 0)}
                                openComments={openComments}
                                showComments={true}
                                countComments={countComments}
                            />
                            {showComments && oneVideoData?.id && (
                                <CommentSection videoId={oneVideoData.id} onClose={() => setShowComments(false)} />
                            )}
                        </>
                    )}
                </View>
            </TapGestureHandler>

            {!isVideoReady && (
                <View style={[positionHelpers.fill, { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.black }]}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
            {/* Heart animation */}
            <Animated.Text style={[{
                position: 'absolute',
                fontSize: 50,
            }, animatedStyle]}>❤️</Animated.Text>
        </Modal>
    );
};

export default FullVideoModal;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { colors, positionHelpers } from '../../../../../../styles';
// import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
import { formatTime } from '../../../../../../utils/formatTime';
import VideoAbsoluteInfo from '../../../../../../components/VideoAbsoluteInfo';
import { HandlerStateChangeEvent, TapGestureHandler, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import CommentSection from '../../../../../../components/CommentSection';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../../../store/store';
import { getVideoCommentsAction } from '../../../../../../redux/VideoRedux/videoAction';

interface ProfileVideoModalProps {
    modalVideo: any
    activeVideoIds: string[]
    onArrowPress?: () => void
    tapX: SharedValue<number>
    tapY: SharedValue<number>
    scale: Animated.SharedValue<number>;
    opacity: Animated.SharedValue<number>;
    handleDoubleTap: (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void;
}

const ProfileVideoModal = ({
    modalVideo,
    activeVideoIds,
    handleDoubleTap,
    onArrowPress,
    tapX,
    tapY,
    scale,
    opacity }: ProfileVideoModalProps) => {
    const dispatch = useReduxDispatch();
    const { countComments } = useReduxSelector((state: RootState) => state.video);
    const videoRef = useRef<any | null>(null);
    const doubleTapRef = useRef<TapGestureHandler>(null);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [durationReady, setDurationReady] = useState(false);

    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (modalVideo && modalVideo?.id) {
            dispatch(getVideoCommentsAction(modalVideo.id));
            setIsVideoReady(false);
            setDurationReady(false);
        }
    }, [modalVideo?.id]);

    // console.log('modalVideo-->', modalVideo);


    // useEffect(() => {
    //     if (modalVideo?.id) {
    //         const interval = setInterval(() => {
    //             setRemainingSeconds(prev => {
    //                 const updated = { ...prev };


    //                 const current = updated[modalVideo.id];
    //                 if (current > 0) {
    //                     updated[modalVideo.id] = current - 1;
    //                 }


    //                 activeVideoIds.forEach(key => {
    //                     const current = updated[key];
    //                     if (current > 0) {
    //                         updated[key] = current - 1;
    //                     }
    //                 });

    //                 return updated;
    //             });
    //         }, 1000);


    //         return () => clearInterval(interval);
    //     }
    // }, [activeVideoIds, modalVideo?.id]);


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
        // position: 'absolute',
        left: tapX.value - 40,
        top: tapY.value - 40,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const openComments = () => {
        // fetchComments();
        setShowComments(true);
    };

    return (
        <Modal visible={!!modalVideo} transparent={false} animationType="fade">
            <TapGestureHandler
                onHandlerStateChange={handleDoubleTap}
                numberOfTaps={2}
                ref={doubleTapRef}>
                <View
                    style={[positionHelpers.fill, { backgroundColor: colors.black }]}

                >
                    {modalVideo && (
                        <>
                            <Video
                                ref={videoRef}
                                source={{ uri: modalVideo?.file?.storagePath }}
                                style={positionHelpers.fill}
                                resizeMode="cover"
                                muted={false}
                                repeat
                                paused={false}
                                controls={false}
                                onLoad={(data) => {
                                    handleVideoLoadModal(modalVideo?.id, data?.duration);
                                }}
                                onProgress={({ currentTime }) => {
                                    if (modalVideo?.id && durations[modalVideo.id]) {
                                        const duration = durations[modalVideo.id];
                                        setRemainingSeconds(prev => {
                                            const newRemaining = duration - currentTime;
                                            if (Math.abs((prev[modalVideo.id] ?? 0) - newRemaining) > 0.25) {
                                                return {
                                                    ...prev,
                                                    [modalVideo.id]: newRemaining,
                                                };
                                            }
                                            return prev;
                                        });

                                        if (currentTime >= duration) {
                                            videoRef.current?.seek(0);
                                            onVideoRepeat(modalVideo.id);
                                        }
                                    }
                                }}
                            // onEnd={() => {
                            //     videoRef.current?.seek(0);
                            //     onVideoRepeat(modalVideo?.id);
                            // }}
                            />
                            <VideoAbsoluteInfo
                                videoCheck={'FULL'}
                                showArrow={true}
                                onArrowBack={onArrowPress}
                                avatar={modalVideo?.avatar}
                                name={modalVideo?.fullname}
                                likesCount={modalVideo?.like_count}
                                videoDuration={formatTime(modalVideo ? remainingSeconds[modalVideo.id] ?? 0 : 0)}
                                openComments={openComments}
                                showComments={true}
                                countComments={countComments}
                            />
                            {showComments && modalVideo?.id && (
                                <CommentSection videoId={modalVideo.id} onClose={() => setShowComments(false)} />
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

export default ProfileVideoModal;

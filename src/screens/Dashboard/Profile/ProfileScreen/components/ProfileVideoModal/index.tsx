import React, { useEffect, useState, useRef, useCallback } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, View } from 'react-native';
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

    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (modalVideo && modalVideo?.id) {
            dispatch(getVideoCommentsAction(modalVideo.id));
        }
    }, [modalVideo?.id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                const updated = { ...prev };

                if (modalVideo?.id) {
                    const current = updated[modalVideo.id];
                    if (current > 0) {
                        updated[modalVideo.id] = current - 1;
                    }
                }

                activeVideoIds.forEach(key => {
                    const current = updated[key];
                    if (current > 0) {
                        updated[key] = current - 1;
                    }
                });

                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeVideoIds, modalVideo?.id]);


    //Save duration video
    const handleVideoLoadModal = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
        setRemainingSeconds(prev => ({ ...prev, [id]: Math.floor(duration) }));
        setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
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
                                    handleVideoLoadModal(modalVideo?.id, Math.floor(data.duration));
                                }}
                                onEnd={() => {
                                    videoRef.current?.seek(0);
                                    onVideoRepeat(modalVideo?.id);
                                }}
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

            {/* Heart animation */}
            <Animated.Text style={[{
                position: 'absolute',
                fontSize: 50,
            }, animatedStyle]}>❤️</Animated.Text>
        </Modal>
    );
};

export default ProfileVideoModal;

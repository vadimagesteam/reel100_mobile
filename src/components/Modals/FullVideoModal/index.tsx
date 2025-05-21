import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { getVideoCommentsAction } from '../../../redux/VideoRedux/videoAction';
import { colors, positionHelpers } from '../../../styles';
import VideoAbsoluteInfo from '../../VideoAbsoluteInfo';
import { formatTime } from '../../../utils/formatTime';
import CommentSection from '../../CommentSection';
import { VideoItemType } from '../../../redux/CameraRedux/types';

interface FullVideoModalProps {
    setModalVideo: (val: VideoItemType | null) => void | any
    modalVideo: VideoItemType | null | any
}

const FullVideoModal = ({
    modalVideo,
    setModalVideo,
}: FullVideoModalProps) => {
    const dispatch = useReduxDispatch();
    const { countComments } = useReduxSelector((state: RootState) => state.video);
    const videoRef = useRef<any | null>(null);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});

    const [showComments, setShowComments] = useState(false);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    useEffect(() => {
        if (modalVideo && modalVideo?.id) {
            dispatch(getVideoCommentsAction({ videoId: modalVideo.id, userId: modalVideo?.user?.id }));
        }
    }, [modalVideo]);

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((event) => {
            if (event) {
                const { x, y } = event;

                tapX.value = x;
                tapY.value = y;

                scale.value = 1;
                opacity.value = 1;

                scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
                    scale.value = withTiming(0, { duration: 500 });
                    opacity.value = withTiming(0, { duration: 500 });
                });
            }
        });


    //Save duration video
    const handleVideoLoadModal = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
        setRemainingSeconds(prev => ({ ...prev, [id]: duration }));
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
        left: tapX.value - 40,
        top: tapY.value - 40,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const openComments = () => {
        setShowComments(true);
    };


    return (
        <Modal visible={!!modalVideo} transparent={false} animationType="fade">
            <GestureDetector gesture={doubleTapGesture}>
                <View
                    style={[positionHelpers.fill, { backgroundColor: colors.black }]}

                >
                    {modalVideo && (
                        <>
                            <Video
                                key={modalVideo?.id}
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
                            />
                            <VideoAbsoluteInfo
                                videoCheck={'FULL'}
                                showArrow={true}
                                onArrowBack={() => {
                                    setModalVideo(null);
                                    setShowComments(false);
                                }}
                                // avatar={modalVideo?.avatar}
                                // name={modalVideo?.fullname}
                                // likesCount={modalVideo?.like_count}
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
            </GestureDetector>

            {/* Heart animation */}
            <Animated.Text style={[positionHelpers.absolute, cs.animatedLike, animatedStyle]}>❤️</Animated.Text>
        </Modal>
    );
};

const cs = StyleSheet.create({
    animatedLike: {
        fontSize: 50,
    },
});

export default FullVideoModal;

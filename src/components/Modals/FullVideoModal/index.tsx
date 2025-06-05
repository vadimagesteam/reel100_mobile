import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { colors, positionHelpers } from '../../../styles';
import VideoAbsoluteInfo from '../../VideoAbsoluteInfo';
import { formatTime } from '../../../utils/formatTime';
import CommentSection from '../../CommentSection';
import { VideoItemType } from '../../../redux/CameraRedux/types';
import { deleteLikeAction, getLikesAction, setLikeAction } from '../../../redux/LikesRedux/likesAction';
import { LoaderIndicator } from '../../UI';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../navigation/routes';
import { getOneUserAction } from '../../../redux/UsersRedux/usersAction';

interface FullVideoModalProps {
    setModalVideo: (val: VideoItemType | null) => void | any
    modalVideo: VideoItemType | null | any
}

const FullVideoModal = ({
    modalVideo,
    setModalVideo,
}: FullVideoModalProps) => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const { likesData } = useReduxSelector((state: RootState) => state.likes);
    const { user } = useReduxSelector((state: RootState) => state.auth);
    const videoRef = useRef<any | null>(null);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
    const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
    const [pausedVideo, setPausedVideo] = useState<boolean>(false);

    const [showComments, setShowComments] = useState<boolean>(false);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    useEffect(() => {
        if (modalVideo && modalVideo?.id) {
            dispatch(getLikesAction({ userId: modalVideo?.user?.id, videoId: modalVideo?.id }));
            setIsVideoLoading(true);
            setPausedVideo(false);
        }
    }, [modalVideo]);

    const handleSingleTap = useCallback(() => {
        setPausedVideo((prev) => !prev);
    }, []);

    const handleDoubleTap = (x: number, y: number) => {
        if (!modalVideo?.id || !modalVideo.user?.id) { return; }

        tapX.value = x;
        tapY.value = y;

        scale.value = 1;
        opacity.value = 1;

        scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
            scale.value = withTiming(0, { duration: 500 });
            opacity.value = withTiming(0, { duration: 500 });
        });

        const likesBodyData = {
            dataLike: {
                typeField: 'Like',
                user: { id: user?.id },
                video: { id: modalVideo.id },
            },
            userId: modalVideo.user.id,
        };

        const existingUserLike = likesData.find(like => like?.user?.id === user?.id);

        if (existingUserLike) {
            dispatch(deleteLikeAction({ id: existingUserLike.id, userId: modalVideo.user.id, videoId: modalVideo.id }));
        } else {
            dispatch(setLikeAction(likesBodyData));
        }
    };

    const singleTapGesture = Gesture.Tap()
        .maxDuration(250)
        .onEnd(() => {
            runOnJS(handleSingleTap)();
        });


    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((event) => {
            if (event && modalVideo?.id && modalVideo.user.id) {
                runOnJS(handleDoubleTap)(event.x, event.y);
            }
        });

    const combinedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);


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

    const openComments = useCallback(() => {
        setShowComments(true);
    }, []);

    const openShare = useCallback(async () => {
        const currentVideo = modalVideo?.file?.storagePath;
        if (!currentVideo) {
            console.warn('URL video not available');
            return;
        }

        let shareUrl = currentVideo;
        if (!shareUrl.startsWith('http://') && !shareUrl.startsWith('https://') && !shareUrl.startsWith('file://')) {
            shareUrl = 'file://' + shareUrl;
        }

        const options = {
            // title: '',
            // message: '',
            url: shareUrl,
            failOnCancel: false,
        };

        try {
            const result = await Share.open(options);
            console.log('Share result:', result);
        } catch (error) {
            console.error('Share error:', error);
        }
    }, [modalVideo]);

    return (
        <Modal visible={!!modalVideo} transparent={false} animationType="fade">

            <View
                style={[positionHelpers.fill, { backgroundColor: colors.black }]}

            >
                {isVideoLoading && (
                    <LoaderIndicator />
                )}
                {modalVideo?.file?.storagePath && (
                    <>
                        <GestureDetector gesture={combinedGesture}>
                            <View style={positionHelpers.fill}>
                                <Video
                                    key={modalVideo?.id}
                                    ref={videoRef}
                                    source={{ uri: modalVideo?.file?.storagePath }}
                                    style={positionHelpers.fill}
                                    resizeMode="cover"
                                    muted={false}
                                    repeat
                                    paused={pausedVideo}
                                    controls={false}
                                    onLoad={(data) => {
                                        handleVideoLoadModal(modalVideo?.id, data?.duration);
                                        setIsVideoLoading(false);

                                        setTimeout(() => {
                                            videoRef.current?.seek(0);
                                        }, 100);
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
                            </View>
                        </GestureDetector>
                        <VideoAbsoluteInfo
                            videoCheck={'FULL'}
                            showArrow={true}
                            onArrowBack={() => {
                                setModalVideo(null);
                                setShowComments(false);
                            }}
                            onNameClick={() => {
                                if (user?.id !== modalVideo.user.id) {
                                    dispatch(getOneUserAction(modalVideo.user.id));
                                    navigation.navigate(DASHBOARD_ROUTES.USER_PROFILE_SCREEN, { idUser: modalVideo.user.id });
                                    setModalVideo(null);
                                }
                            }}
                            avatar={''}
                            name={`${modalVideo?.user?.firstName} ${modalVideo?.user?.lastName}`}
                            likeCheck={likesData.some(like => like?.user?.id === user?.id)}
                            likesCount={likesData.length}
                            videoDuration={formatTime(modalVideo ? remainingSeconds[modalVideo.id] ?? 0 : 0)}
                            openComments={openComments}
                            showComments={true}
                            countComments={modalVideo?.commentsCount}
                            paused={pausedVideo}
                            showShare={true}
                            onShare={openShare}
                        />
                        {showComments && modalVideo?.id && (
                            <CommentSection videoId={modalVideo.id} userId={modalVideo.user.id} onClose={() => setShowComments(false)} />
                        )}
                    </>
                )}
            </View>


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

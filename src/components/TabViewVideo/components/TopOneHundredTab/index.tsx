import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { getVideosTopAction } from '../../../../redux/CameraRedux/cameraActions';
import { positionHelpers } from '../../../../styles';
import { formatTime } from '../../../../utils/formatTime';
import { deleteLikeAction, getLikesAction, setLikeAction } from '../../../../redux/LikesRedux/likesAction';
import { setHasMore } from '../../../../redux/CameraRedux/cameraSlice';
import VideoAbsoluteInfo from '../../../VideoAbsoluteInfo';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import { getOneUserAction } from '../../../../redux/UsersRedux/usersAction';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import VideoItemContent from './components/VideoItemContent';
import { getVideoCommentsAction } from '../../../../redux/VideoRedux/videoAction';

const { height } = Dimensions.get('window');
const TAKE = 5;

const TopOneHundredTab = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const dispatch = useReduxDispatch();
    const { likesData } = useReduxSelector((state: RootState) => state.likes);
    const { user } = useReduxSelector((state: RootState) => state.auth);
    const { videosTop100, page, hasMore } = useReduxSelector<any>((state: RootState) => state.camera);
    const scrollIndexRef = useRef(0);
    const currentTimeRef = useRef(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const insets = useSafeAreaInsets();
    // const tabNavigationHeight = 70;
    const tabNavigationHeight = Math.max(150, Math.min(height * 0.17, 250));
    const videoHeight = height - insets.top - insets.bottom - tabNavigationHeight;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [durations, setDurations] = useState<{ [key: string]: number }>({});
    const [timeLefts, setTimeLefts] = useState<{ [key: string]: number }>({});

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    useEffect(() => {
        if (
            hasMore &&
            !loadingMore &&
            currentIndex >= videosTop100.length - 2
        ) {
            loadVideos(page);
        }
    }, [currentIndex, hasMore, loadingMore, page]);

    const loadVideos = async (pageNumber: number) => {
        if (loadingMore || !hasMore) { return; }

        setLoadingMore(true);
        try {
            const skip = (pageNumber - 1) * TAKE;
            const response = await dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
            const newVideos = response?.payload || [];

            if (newVideos.length < TAKE) {
                dispatch(setHasMore(false));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (videosTop100.length === 0) { return; }
        const currentVideo = videosTop100[currentIndex];
        if (!currentVideo) { return; }

        dispatch(getLikesAction({ userId: user?.id, videoId: currentVideo.id }));
    }, [currentIndex, user?.id, videosTop100]);

    const onEndReached = () => {
        if (!loadingMore && hasMore) {
            loadVideos(page);
        }
    };

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            setCurrentIndex(index);
            scrollIndexRef.current = index;
        }
    }).current;

    const handleLoad = (id: string, data: { duration: number }) => {
        setDurations((prev) => ({ ...prev, [id]: data.duration }));
        setTimeLefts((prev) => ({ ...prev, [id]: Math.floor(data.duration) }));
    };

    const handleSingleTap = (item: VideoItemType, index: number) => {
        dispatch(getVideoCommentsAction({ videoId: item?.id, userId: item?.user.id }));
        navigation.navigate(DASHBOARD_ROUTES.FULL_VIDEO_SCREEN, {
            initialIndex: index,
            videos: [...videosTop100],
            videoIdParam: item?.id,
            userIdParam: item?.user?.id,
        });
    };

    const handleDoubleTap = (x: number, y: number, videoId: string, videoOwnerId: string) => {
        if (!videoId || !user?.id) { return; }

        // Анімація серця
        tapX.value = x;
        tapY.value = y;

        scale.value = 1;
        opacity.value = 1;

        scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
            scale.value = withTiming(0, { duration: 500 });
            opacity.value = withTiming(0, { duration: 500 });
        });


        const existingLike = likesData.find(
            (like) => like.user?.id === user?.id && like.video?.id === videoId
        );

        if (existingLike) {
            dispatch(deleteLikeAction({ id: existingLike.id, userId: videoOwnerId, videoId }));
        } else {
            const likesBodyData = {
                dataLike: {
                    typeField: 'Like',
                    user: { id: user?.id },
                    video: { id: videoId },
                },
                userId: videoOwnerId,
            };

            dispatch(setLikeAction(likesBodyData));
        }
    };

    const singleTapGesture = (item: VideoItemType, index: number) =>
        Gesture.Tap()
            .maxDelay(250)
            .numberOfTaps(1)
            .onEnd(() => {
                runOnJS(handleSingleTap)(item, index);
            });

    const doubleTapGesture = (videoId: string, videoOwnerId: string) =>
        Gesture.Tap()
            .numberOfTaps(2)
            .onEnd((event) => {
                runOnJS(handleDoubleTap)(event.x, event.y, videoId, videoOwnerId);
            });

    const combinedGesture = (item: VideoItemType, index: number) =>
        Gesture.Exclusive(doubleTapGesture(item.id, item.user.id), singleTapGesture(item, index));

    // Animated style heart
    const animatedStyle = useAnimatedStyle(() => ({
        left: tapX.value - 40,
        top: tapY.value - 40,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const renderItem = ({ item, index }: { item: VideoItemType; index: number }) => {
        const isActive = index === currentIndex && isFocused;

        return (
            <>
                {item.file !== null ? (
                    <VideoItemContent
                        item={item}
                        isActive={isActive}
                        videoHeight={videoHeight}
                        onLoad={(data) => handleLoad(item.id, data)}
                        onProgress={(data) => {
                            if (isActive) {
                                currentTimeRef.current = data.currentTime;
                                const duration = durations[item.id] || 0;
                                setTimeLefts((prev) => ({
                                    ...prev,
                                    [item.id]: Math.max(0, Math.floor(duration - data.currentTime)),
                                }));
                            }
                        }}
                        gesture={combinedGesture(item, index)}
                        renderOverlay={() => (
                            <VideoAbsoluteInfo
                                avatar={''}
                                name={`${item?.user?.firstName} ${item?.user?.lastName}`}
                                videoDuration={formatTime(timeLefts[item.id] || 0)}
                                likeCheck={likesData.some(like => like?.user?.id === user?.id)}
                                likesCount={likesData?.length}
                                videoNumber={index + 1}
                                onNameClick={() => {
                                    if (user?.id !== item.user.id) {
                                        dispatch(getOneUserAction(item.user.id));
                                        navigation.navigate(DASHBOARD_ROUTES.USER_PROFILE_SCREEN, {
                                            idUser: item.user.id,
                                        });
                                    }
                                }}
                            />
                        )}
                    />
                ) : null}
                {/* Heart animation */}
                <Animated.Text style={[positionHelpers.absolute, cs.animatedHeart, animatedStyle]}>❤️</Animated.Text>
            </>
        );
    };

    const renderFooter = () => {
        if (!loadingMore) { return null; }
        return (
            <View style={cs.loadingStyle}>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    };

    return (
        <FlatList
            data={videosTop100}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={videoHeight}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialScrollIndex={scrollIndexRef.current}

            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            style={positionHelpers.fill}
        />
    );
};

const cs = StyleSheet.create({
    animatedHeart: {
        fontSize: 35,
    },
    loadingStyle: {
        padding: 10,
        marginTop: 20,
    },
});

export default TopOneHundredTab;


import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import CommentSection from '../../../../components/CommentSection';
import { colors, positionHelpers } from '../../../../styles';
import { LoaderIndicator } from '../../../../components/UI';
import { formatTime } from '../../../../utils/formatTime';
import { getOneUserAction } from '../../../../redux/UsersRedux/usersAction';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import VideoAbsoluteInfo from '../../../../components/VideoAbsoluteInfo';
import { deleteLikeAction, getLikesAction, setLikeAction } from '../../../../redux/LikesRedux/likesAction';
import { cs } from './styles';
import { getVideoCommentsAction } from '../../../../redux/VideoRedux/videoAction';
import VideoItemContent from '../../../../components/TabViewVideo/components/TopOneHundredTab/components/VideoItemContent';
import { setHasMore } from '../../../../redux/CameraRedux/cameraSlice';
import { getVideosTopAction } from '../../../../redux/CameraRedux/cameraActions';


const { height } = Dimensions.get('window');
const TAKE = 5;

const FullVideoScreen = () => {
    const dispatch = useReduxDispatch();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const isFocused = useIsFocused();

    const { initialIndex, videoIdParam, userIdParam } = route.params;
    const { countComments } = useReduxSelector((state: RootState) => state.video);
    const { likesData } = useReduxSelector((state) => state.likes);
    const { user } = useReduxSelector((state) => state.auth);
    const { videosTop100, page, hasMore } = useReduxSelector((state: RootState) => state.camera);

    const videoHeight = height;

    const flatListRef = useRef<FlatList>(null);
    const scrollIndexRef = useRef(initialIndex);
    const currentTimeRef = useRef(0);
    const videoRef = useRef<any | null>(null);

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [durations, setDurations] = useState({});
    const [timeLefts, setTimeLefts] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);

    const [showComments, setShowComments] = useState<boolean>(false);
    // Heart animation
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

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

    const onEndReached = () => {
        if (!loadingMore && hasMore) {
            loadVideos(page);
        }
    };

    useEffect(() => {
        const currentVideo = videosTop100[currentIndex];
        if (currentVideo && user?.id) {
            // dispatch(getVideoCommentsAction({ videoId: currentVideo.id, userId: videos[currentIndex]?.user?.id }));
            dispatch(getLikesAction({ userId: videosTop100[currentIndex]?.user?.id, videoId: currentVideo.id }));
        }
    }, [currentIndex]);

    const handleLoad = (id: string, data: { duration: number }) => {
        setDurations((prev) => ({ ...prev, [id]: data.duration }));
        setTimeLefts((prev) => ({ ...prev, [id]: Math.floor(data.duration) }));
    };

    const handleDoubleTap = (x: number, y: number, videoId: string, videoOwnerId: string) => {
        if (!videoId || !user?.id) { return; }

        tapX.value = x;
        tapY.value = y;
        scale.value = 1;
        opacity.value = 1;

        scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
            scale.value = withTiming(0, { duration: 500 });
            opacity.value = withTiming(0, { duration: 500 });
        });

        const existingLike = likesData.find(
            (like) => like.user?.id === user.id && like.video?.id === videoId
        );

        if (existingLike) {
            dispatch(deleteLikeAction({ id: existingLike.id, userId: videoOwnerId, videoId }));
        } else {
            dispatch(setLikeAction({
                dataLike: {
                    typeField: 'Like',
                    user: { id: user.id },
                    video: { id: videoId },
                },
                userId: videoOwnerId,
            }));
        }
    };

    const doubleTapGesture = (videoId: string, videoOwnerId: string) =>
        Gesture.Tap()
            .numberOfTaps(2)
            .onEnd((event) => {
                runOnJS(handleDoubleTap)(event.x, event.y, videoId, videoOwnerId);
            });

    const animatedStyle = useAnimatedStyle(() => ({
        left: tapX.value - 40,
        top: tapY.value - 40,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            setCurrentIndex(index);
            scrollIndexRef.current = index;
        }
    }).current;

    const openComments = () => {
        setShowComments(true);
    };

    const renderItem = ({ item, index }) => {
        const isActive = index === currentIndex && isFocused;

        if (!item?.file) {
            return <View style={{ height: videoHeight, backgroundColor: 'black' }} />;
        }

        return (
            <View style={{ height: videoHeight }}>
                <VideoItemContent
                    item={item}
                    isActive={isActive}
                    videoStyle={positionHelpers.fill}
                    onLoad={(data) => handleLoad(item.id, data)}
                    muted={false}
                    onProgress={(data) => {
                        if (isActive) {
                            if (initialLoading && data.currentTime > 0.1) {
                                setInitialLoading(false);
                            }
                            currentTimeRef.current = data.currentTime;
                            const duration = durations[item.id] || 0;
                            setTimeLefts((prev) => ({
                                ...prev,
                                [item.id]: Math.max(0, Math.floor(duration - data.currentTime)),
                            }));
                        }
                    }}
                    gesture={doubleTapGesture(item.id, item.user.id)}
                    renderOverlay={() => (
                        <VideoAbsoluteInfo
                            videoCheck="FULL"
                            avatar={''}
                            name={`${item.user?.firstName} ${item.user?.lastName}`}
                            videoDuration={formatTime(timeLefts[item.id] || 0)}
                            likeCheck={likesData.some(like => like.user?.id === user?.id)}
                            likesCount={likesData.length}
                            // likesCount={likesData?.length}
                            videoNumber={index + 1}
                            openComments={openComments}
                            showComments={true}
                            countComments={item?.commentsCount}
                            showArrow
                            onArrowBack={() => navigation.goBack()}
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
                <Animated.Text style={[positionHelpers.absolute, cs.animatedHeart, animatedStyle]}>
                    ❤️
                </Animated.Text>
            </View >
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
        <>
            {initialLoading && <LoaderIndicator />}
            <FlatList
                ref={flatListRef}
                data={videosTop100}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                pagingEnabled
                snapToInterval={videoHeight}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                initialScrollIndex={videosTop100.length > initialIndex ? initialIndex : 0}
                getItemLayout={(data, index) => ({
                    length: videoHeight,
                    offset: videoHeight * index,
                    index,
                })}
                onViewableItemsChanged={onViewableItemsChanged}
                onScrollToIndexFailed={({ index }) => {
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({ index, animated: false });
                    }, 100);
                }}
                scrollEnabled={!showComments}
                style={positionHelpers.fill}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />

            {showComments && (
                <CommentSection
                    videoId={videosTop100[currentIndex]?.id}
                    userId={videosTop100[currentIndex]?.user?.id}
                    onClose={() => setShowComments(false)}
                />
            )}
        </>
    );
};


export default FullVideoScreen;

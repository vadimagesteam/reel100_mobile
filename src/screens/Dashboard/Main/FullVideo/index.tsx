import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import CommentSection from '../../../../components/CommentSection';
import { positionHelpers } from '../../../../styles';
import { LoaderIndicator } from '../../../../components/UI';
import { getOneUserAction } from '../../../../redux/UsersRedux/usersAction';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { deleteLikeAction, getLikesAction, setLikeAction } from '../../../../redux/LikesRedux/likesAction';
import { setPage } from '../../../../redux/CameraRedux/cameraSlice';
import { getVideosTopAction } from '../../../../redux/CameraRedux/cameraActions';
import { useHeartAnimatedStyle } from '../../../../utils/animatedHeartStyle';
import VideoListItem from '../../../../components/VideoScrollList/VideoListItem';
import { VideoItemType } from '../../../../redux/CameraRedux/types';

const { height } = Dimensions.get('window');
const TAKE = 5;

const FullVideoScreen = () => {
    const dispatch = useReduxDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { initialIndex } = route.params;
    const { likesData } = useReduxSelector((state) => state.likes);
    const { user } = useReduxSelector((state) => state.auth);
    const { videosTop100, page, hasMore, loadingTopTab } = useReduxSelector((state: RootState) => state.camera);

    const videoHeight = height;

    const flatListRef = useRef<FlatList>(null);
    const scrollIndexRef = useRef(initialIndex);

    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
    const [durations, setDurations] = useState<{ [key: string]: number }>({});
    const [timeLefts, setTimeLefts] = useState<{ [key: string]: number }>({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [pausedById, setPausedById] = useState<{ [key: string]: boolean }>({});

    const [showComments, setShowComments] = useState<boolean>(false);
    // Heart animation
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    const animatedStyle = useHeartAnimatedStyle(tapX, tapY, scale, opacity);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (
            hasMore &&
            currentIndex >= videosTop100.length - 2
        ) {
            const skip = (page - 1) * TAKE;
            dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
        }
    }, [currentIndex, hasMore, page]);

    const onEndReached = () => {
        if (!loadingTopTab && hasMore) {
            const skip = (page - 1) * TAKE;
            dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
            dispatch(setPage(page + 1));
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

    const handleSingleTap = useCallback((videoId: string) => {
        setPausedById(prev => ({
            ...prev,
            [videoId]: !prev[videoId],
        }));
    }, []);

    const handleDoubleTap = useCallback((x: number, y: number, videoId: string, videoOwnerId: string) => {
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
    }, [likesData, user?.id]);

    const singleTapGesture = useCallback((videoId: string) =>
        Gesture.Tap()
            .maxDuration(250)
            .onEnd(() => {
                runOnJS(handleSingleTap)(videoId);
            }), [handleSingleTap]);

    const doubleTapGesture = useCallback((videoId: string, videoOwnerId: string) =>
        Gesture.Tap()
            .numberOfTaps(2)
            .onEnd((event) => {
                runOnJS(handleDoubleTap)(event.x, event.y, videoId, videoOwnerId);
            }), [handleDoubleTap]);

    const combinedGesture = useCallback((item: VideoItemType) =>
        Gesture.Exclusive(
            doubleTapGesture(item.id, item.user.id),
            singleTapGesture(item.id)
        ), [doubleTapGesture, singleTapGesture]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            setCurrentIndex(index);
            scrollIndexRef.current = index;
            setPausedById({});
        }
    }).current;

    const openComments = () => {
        setShowComments(true);
    };

    const renderItem = ({ item, index }: { item: VideoItemType; index: number }) => {
        const isActive = index === currentIndex && isFocused;
        const itemFile = item.file !== null;

        return (
            <>
                {itemFile ? (
                    <VideoListItem
                        item={item}
                        index={index}
                        isActive={isActive}
                        paused={pausedById[item.id] ?? false}
                        videoHeight={videoHeight}
                        gesture={combinedGesture(item)}
                        onLoad={(data) => handleLoad(item.id, data)}
                        durations={durations}
                        setTimeLefts={setTimeLefts}
                        timeLeft={timeLefts[item.id] || 0}
                        likesData={likesData}
                        likeCheck={likesData.some(like => like?.user?.id === user?.id)}
                        videoCheck="FULL"
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
                        showShare={true}
                        animatedStyle={animatedStyle}
                    />
                ) : null}
            </>
        );
    };

    const renderFooter = () => {
        if (!loadingTopTab) { return null; }
        return (
            <LoaderIndicator variantTwo />
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

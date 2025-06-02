import React, { useState, useRef, useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { runOnJS, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { getVideosTopAction } from '../../../../redux/CameraRedux/cameraActions';
import { positionHelpers } from '../../../../styles';
import { deleteLikeAction, getLikesAction, setLikeAction } from '../../../../redux/LikesRedux/likesAction';
import { setPage } from '../../../../redux/CameraRedux/cameraSlice';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { getVideoCommentsAction } from '../../../../redux/VideoRedux/videoAction';
import { LoaderIndicator } from '../../../UI';
import VideoListItem from '../../../VideoScrollList/VideoListItem';
import { useHeartAnimatedStyle } from '../../../../utils/animatedHeartStyle';

const { height } = Dimensions.get('window');
const TAKE = 5;

const TopOneHundredTab = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const dispatch = useReduxDispatch();
    const { likesData } = useReduxSelector((state: RootState) => state.likes);
    const { user } = useReduxSelector((state: RootState) => state.auth);
    const { videosTop100, page, hasMore, loadingTopTab } = useReduxSelector<any>((state: RootState) => state.camera);
    const scrollIndexRef = useRef(0);

    const insets = useSafeAreaInsets();
    // const tabNavigationHeight = 70;
    const tabNavigationHeight = Math.max(150, Math.min(height * 0.17, 250));
    const videoHeight = height - insets.top - insets.bottom - tabNavigationHeight;

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [durations, setDurations] = useState<{ [key: string]: number }>({});
    const [timeLefts, setTimeLefts] = useState<{ [key: string]: number }>({});

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    const animatedStyle = useHeartAnimatedStyle(tapX, tapY, scale, opacity);

    useEffect(() => {
        if (
            hasMore &&
            currentIndex >= videosTop100.length - 2
        ) {
            const skip = (page - 1) * TAKE;
            dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
        }
    }, [currentIndex, hasMore, page]);

    useEffect(() => {
        if (videosTop100.length === 0) { return; }
        const currentVideo = videosTop100[currentIndex];
        if (!currentVideo) { return; }

        dispatch(getLikesAction({ userId: user?.id, videoId: currentVideo.id }));
    }, [currentIndex, user?.id, videosTop100]);

    const onEndReached = () => {
        if (!loadingTopTab && hasMore) {
            const skip = (page - 1) * TAKE;
            dispatch(getVideosTopAction({ skip, take: TAKE, orderBy: { createdAt: 'desc' } }));
            dispatch(setPage(page + 1));
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

        // animation heart
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
                        videoHeight={videoHeight}
                        gesture={combinedGesture(item, index)}
                        onLoad={(data) => handleLoad(item.id, data)}
                        durations={durations}
                        setTimeLefts={setTimeLefts}
                        timeLeft={timeLefts[item.id] || 0}
                        likesData={likesData}
                        likeCheck={likesData.some(like => like?.user?.id === user?.id)}
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
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            style={positionHelpers.fill}
        />
    );
};

export default TopOneHundredTab;


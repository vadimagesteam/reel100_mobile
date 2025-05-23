import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VideoItem from './components/VideoItem';
import { positionHelpers } from '../../../../styles';


import { formatTime } from '../../../../utils/formatTime';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import { useReduxDispatch } from '../../../../store/store';
import { LoaderIndicator } from '../../../UI';
import FullVideoModal from '../../../Modals/FullVideoModal';

const { height } = Dimensions.get('screen');
const TAKE = 10;

const TopOneHundredTab = () => {
    const dispatch = useReduxDispatch();
    // const navigation = useNavigation<any>();
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    // const tabNavigationHeight = 70;
    const tabNavigationHeight = Math.max(150, Math.min(height * 0.17, 250));
    const videoHeight = height - insets.top - insets.bottom - tabNavigationHeight;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});

    const [videos, setVideos] = useState<VideoItemType[]>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchVideos(true);
    }, []);

    const fetchVideos = async (reset = false) => {
        const skip = reset ? 0 : page * TAKE;

        const result = await dispatch(getVideosAction({
            skip,
            take: TAKE,
            orderBy: { createdAt: 'desc' },
        }));

        const newVideos = result?.payload || [];

        if (reset) {
            setVideos(newVideos);
            setPage(1);
        } else {
            setVideos(prev => [...prev, ...newVideos]);
            setPage(prev => prev + 1);
        }

        setHasMore(newVideos.length === TAKE);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeIndex !== null) {
                const id = videos[activeIndex]?.id;
                if (id) {
                    setRemainingSeconds(prev => {
                        const current = prev[id];
                        if (current > 0) {
                            return {
                                ...prev,
                                [id]: current - 1,
                            };
                        }
                        return prev;
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    //Save duration video
    const handleVideoLoad = useCallback((id: string, duration: number) => {
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

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0 && viewableItems[0]?.index !== undefined) {
            setActiveIndex(viewableItems[0].index);
            scale.value = 0;
            opacity.value = 0;
            onVideoRepeat(viewableItems[0]?.item?.id);
        }
    }, [opacity, scale, onVideoRepeat]);

    //TYPE FOR 'ITEM' !!!!!
    const renderItem = useCallback(
        ({ item, index }: { item: any, index: number }) => {
            const fullName = `${item?.user?.firstName} ${item?.user?.lastName}`;
            return (
                <>
                    {item?.file !== null ? (
                        <VideoItem
                            source={item.file?.storagePath}
                            isActive={index === activeIndex}
                            videoHeight={videoHeight}
                            tapX={tapX}
                            tapY={tapY}
                            scale={scale}
                            opacity={opacity}
                            avatar={''}
                            name={fullName}
                            videoId={item?.id}
                            videoNumber={item?.list_number}
                            videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
                            onVideoLoad={(duration) => handleVideoLoad(item.id, duration)}
                            likesCount={item?.like_count}
                            onVideoRepeat={() => onVideoRepeat(item?.id)}
                        // onVideoPress={() => setModalVideo(item)}
                        />

                    ) : null}
                </>
            );
        },
        [
            activeIndex,
            videoHeight,
            tapX,
            tapY,
            scale,
            opacity,
            remainingSeconds,
            onVideoRepeat,
            handleVideoLoad,
        ]
    );

    const handleLoadMore = async () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            await fetchVideos(false);
            setLoadingMore(false);
        }
    };
    return (
        <GestureHandlerRootView style={positionHelpers.fill}>
            <FlatList
                ref={flatListRef}
                data={videos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                snapToInterval={videoHeight}
                contentContainerStyle={positionHelpers.flexGrow}
                decelerationRate="fast"
                initialNumToRender={6}
                windowSize={6}
                maxToRenderPerBatch={6}
                removeClippedSubviews={true}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore && hasMore ? (<View style={positionHelpers.mt30}>
                        <LoaderIndicator variantTwo />
                    </View>) : null
                }
            />

            {/* <FullVideoScrollModal
                visible={visible}
                selectedId={selectedVideoId}
                onVisible={() => setVisible(false)}
            /> */}
            {/* Video Full Modal */}
            <FullVideoModal
                modalVideo={modalVideo}
                setModalVideo={setModalVideo}
            />
        </GestureHandlerRootView>
    );
};

export default TopOneHundredTab;

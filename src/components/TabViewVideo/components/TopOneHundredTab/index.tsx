import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, HandlerStateChangeEvent, State, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VideoItem from './components/VideoItem';
import { positionHelpers } from '../../../../styles';


import { formatTime } from '../../../../utils/formatTime';
import { VideoItemType } from '../../../../redux/CameraRedux/types';

const { height } = Dimensions.get('screen');

interface TopOneHundredTabProps {
    allVideo: VideoItemType[]
}

const TopOneHundredTab = ({ allVideo }: TopOneHundredTabProps) => {
    // const navigation = useNavigation<any>();
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const tabNavigationHeight = Math.max(150, Math.min(height * 0.19, 250));
    const videoHeight = height - insets.top - insets.bottom - tabNavigationHeight;
    const [activeIndex, setActiveIndex] = useState<number | null>();

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeIndex !== null) {
                const id = allVideo[activeIndex]?.id;
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

    const handleSingleTap = useCallback(
        (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>, selectedId: string) => {

            // console.log('selectedId-->', selectedId);
            if (event.nativeEvent.state === State.END) {

                const index = allVideo.findIndex(video => video.id === selectedId);
                // console.log('--index-->', index);
                // dispatch(getVideosAction());
                // navigation.navigate(DASHBOARD_ROUTES.FULL_VIDEO_SCREEN, {
                //     // videos: allVideo,
                //     selectedId,
                //     index,
                // });
                // runOnJS(navigation.navigate)(DASHBOARD_ROUTES.FULL_VIDEO_SCREEN, {
                //     // videos: allVideo,
                //     selectedId,
                //     index,
                // });
            }
        },
        []
    );
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
                            onSingleTap={(event) => handleSingleTap(event, item?.id)}
                            onDoubleTap={(event) => handleDoubleTap(event)}
                            avatar={item?.avatar}
                            name={item?.fullname}
                            videoNumber={item?.list_number}
                            videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
                            onVideoLoad={(duration) => handleVideoLoad(item.id, duration)}
                            likesCount={item?.like_count}
                            onVideoRepeat={() => onVideoRepeat(item?.id)}
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
            handleSingleTap,
            handleDoubleTap,
            onVideoRepeat,
            handleVideoLoad,
        ]
    );

    return (
        <GestureHandlerRootView style={positionHelpers.fill}>
            <FlatList
                ref={flatListRef}
                data={allVideo}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                snapToInterval={videoHeight}
                contentContainerStyle={positionHelpers.flexGrow}
                decelerationRate="fast"
            />

            {/* <FullVideoScrollModal
                visible={visible}
                selectedId={selectedVideoId}
                onVisible={() => setVisible(false)}
            /> */}
        </GestureHandlerRootView>
    );
};

export default TopOneHundredTab;

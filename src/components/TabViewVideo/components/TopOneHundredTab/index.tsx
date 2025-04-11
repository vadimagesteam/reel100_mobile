import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, HandlerStateChangeEvent, State, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VideoItem from './components/VideoItem';
import { positionHelpers } from '../../../../styles';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { videoSources } from './mockData';
import { formatTime } from '../../../../utils/formatTime';

const { height } = Dimensions.get('screen');

const TopOneHundredTab = () => {
    const navigation = useNavigation<any>();
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const tabNavigationHeight = Math.max(150, Math.min(height * 0.19, 250));
    const videoHeight = height - insets.top - insets.bottom - tabNavigationHeight;
    const [activeIndex, setActiveIndex] = useState<number | null>();

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });

    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeIndex !== null) {
                const id = videoSources[activeIndex]?.id;
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
            if (event.nativeEvent.state === State.END) {
                const index = videoSources.findIndex(video => video.id === selectedId);
                runOnJS(navigation.navigate)(DASHBOARD_ROUTES.FULL_VIDEO_SCREEN, {
                    videos: videoSources,
                    index,
                });
            }
        },
        [navigation]
    );

    const handleDoubleTap = useCallback(
        (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
            if (event.nativeEvent.state === State.END) {
                const { x, y } = event.nativeEvent;
                runOnJS(setTapPosition)({ x, y });

                scale.value = 1;
                opacity.value = 1;

                scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
                    scale.value = withTiming(0, { duration: 500 });
                    opacity.value = withTiming(0, { duration: 500 });
                });
            }
        },
        [opacity, scale]
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
                <VideoItem
                    source={item.uri}
                    isActive={index === activeIndex}
                    videoHeight={videoHeight}
                    tapPosition={tapPosition}
                    scale={scale}
                    opacity={opacity}
                    handleSingleTap={(event) => handleSingleTap(event, item?.id)}
                    handleDoubleTap={(event) => handleDoubleTap(event)}
                    avatar={item?.avatar}
                    name={item?.fullname}
                    videoNumber={item?.list_number}
                    videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
                    onVideoLoad={(duration) => handleVideoLoad(item.id, duration)}
                    likesCount={item?.like_count}
                    onVideoRepeat={() => onVideoRepeat(item?.id)}
                />
            );
        },
        [
            activeIndex,
            videoHeight,
            tapPosition,
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
                data={videoSources}
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
        </GestureHandlerRootView>
    );
};

export default TopOneHundredTab;

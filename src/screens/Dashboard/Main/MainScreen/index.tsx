import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { colors, positionHelpers } from '../../../../styles';
import DropdownMenu from '../../../../components/DropdownMenu';
import { SvgIcon } from '../../../../components/UI';
import { states } from './mockData';
import {
    RootState,
    useReduxDispatch,
    useReduxSelector,
    // useReduxSelector
} from '../../../../store/store';
import { getStatesAction } from '../../../../redux/StatesRedux/statesAction';
import { requestLocationPermission, getStateFromCoords } from './helpers';
import TabViewVideo from '../../../../components/TabViewVideo';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { getUserInfoAction } from '../../../../redux/AuthRedux/authAction';
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import MenuModal from '../../../../components/Modals/MemuModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { HandlerStateChangeEvent, State, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import VideoItem from '../../../../components/TabViewVideo/components/TopOneHundredTab/components/VideoItem';
import { formatTime } from '../../../../utils/formatTime';

const { height } = Dimensions.get('screen');
const MainScreen = () => {
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector((state: RootState) => state?.camera);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [_, setSelectedAutoState] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('top_100');

    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const topHeaderHeight = 15;
    const tabNavigationHeight = 70;
    // const tabNavigationHeight = Math.max(150, Math.min(height * 0.19, 250));
    const videoHeight = height - insets.top - topHeaderHeight - tabNavigationHeight;
    const [activeIndex, setActiveIndex] = useState<number | null>();

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    const [videoStartTimes, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});

    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getStatesAction());
        dispatch(getUserInfoAction());
        dispatch(getVideosAction());
    }, []);

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

    useEffect(() => {
        const getUserLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                console.warn('Location permission denied');
                return;
            }

            Geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    const state = await getStateFromCoords(latitude, longitude);
                    if (state) {
                        setSelectedAutoState(state);
                        setSelectedState(prevState => prevState ?? state);
                    } else {
                        console.warn('Не вдалося отримати штат через Nominatim');
                    }
                },
                async (error) => {
                    console.error('Geolocation error:', error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getUserLocation();
    }, []);
    ///

    const handleSingleTap = useCallback(
        (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>, selectedId: string) => {

            // console.log('selectedId-->', selectedId);
            if (event.nativeEvent.state === State.END) {

                const index = videos.findIndex(video => video.id === selectedId);
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

    const renderItem = useCallback(
        ({ item, index }: { item: any, index: number }) => {
            return (
                <>
                    {item?.file !== null ? (
                        <VideoItem
                            source={item.file?.storagePath}
                            isActive={index === activeIndex}
                            videoHeight={videoHeight}
                            // tapPosition={tapPosition}
                            tapX={tapX}
                            tapY={tapY}
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
                    ) : null}
                </>
            );
        },
        [
            activeIndex,
            videoHeight,
            // tapPosition
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
        <>
            <CustomHeader title="00:00:00"
            // showAnimationHeader={true}
            // onMenuPress={() => setVisible(true)}
            // dataStates={states}
            />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <View style={[positionHelpers.ph16, positionHelpers.mt10, positionHelpers.rowFillCenter]}>
                    <DropdownMenu
                        data={states}
                        placeholder="Change Country"
                        selectedValue={selectedState}
                        onSelect={setSelectedState}
                    />
                    <TouchableOpacity
                        onPress={() => setVisible(true)}

                    >
                        <SvgIcon image="menu" />
                    </TouchableOpacity>
                </View>

                {/* TabView for Video */}
                <TabViewVideo allVideo={videos} activeTab={activeTab} setActiveTab={setActiveTab} />
                {/* <FlatList
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
                /> */}
            </SafeAreaView >

            {/* MenuModal */}
            <MenuModal visible={visible} onVisible={() => setVisible(false)} />
        </>
    );
};

export default MainScreen;

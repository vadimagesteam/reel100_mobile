import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Keyboard, StyleSheet } from 'react-native';
import { HandlerStateChangeEvent, State, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, withTiming, runOnJS, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { BodyText, Input, LoaderIndicator, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';
import { generateBlocks } from '../../../../components/TabViewVideo/components/StateFeedTab/helpers/generateBlocks';
import { VideoItemType } from './types';
import { debounce } from '../../../../utils/debounce';
import FullVideoModal from '../../../../components/TabViewVideo/components/StateFeedTab/components/FullVideoModal';
import RenderBlock from '../../../../components/TabViewVideo/components/StateFeedTab/components/RenderVideo';
import { useReduxSelector } from '../../../../store/store';
import MenuModal from '../../../../components/Modals/MemuModal';
import { usersData } from '../../Profile/ProfileScreen/mockData';

const FourUScreen = () => {
    const { videos } = useReduxSelector(state => state?.camera);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const inputRef = useRef(null);
    const [activeVideoIds, setActiveVideoIds] = useState<string[]>([]);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [durations, setDurations] = useState<Record<string, number>>({});

    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
    const [inputY, setInputY] = useState<number>(0);
    const overlayOpacity = useSharedValue(0);
    const overlayTranslateY = useSharedValue(0);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    }, []);


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

    useEffect(() => {
        if (isSearchActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current.measure((x, y, width, height, pageX, pageY) => {
                    setInputY(pageY + height);
                });
            }, 100);
        }
    }, [isSearchActive]);

    useEffect(() => {
        if (isSearchActive) {
            overlayOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
            overlayTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
        } else {
            overlayOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) });
            overlayTranslateY.value = withTiming(20, { duration: 200, easing: Easing.in(Easing.ease) });
        }
    }, [isSearchActive]);

    //Save duration video
    const handleVideoLoad = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
    }, []);

    const onViewableItemsChanged = useRef(
        debounce(({ viewableItems }: { viewableItems: any[] }) => {
            const visibleIds = viewableItems.flatMap(({ item, index }) =>
                item.items.map((video: VideoItemType, videoIndex: number) => `${index}-${videoIndex}-${video.id}`)
            );
            setActiveVideoIds(visibleIds);
        }, 100)
    );

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        transform: [{ translateY: overlayTranslateY.value }],
    }));

    return (
        <>
            <View style={positionHelpers.fill}>
                {!isSearchActive && <CustomHeader title="00:00:00" />}
                <SafeAreaView
                    style={[
                        positionHelpers.fill,
                        isSearchActive ? {} : positionHelpers.mb25,
                        {
                            backgroundColor: colors.black4,
                            marginBottom: isSearchActive ? 0 : 70,
                        },
                    ]}
                >
                    <ScrollView contentContainerStyle={[positionHelpers.ph16]}>
                        <View style={[positionHelpers.mt10, positionHelpers.mb20, positionHelpers.alignItemsCenterRow]}>
                            {isSearchActive && (< TouchableOpacity style={{ marginRight: 15 }} onPress={() => {
                                setIsSearchActive(false);
                                Keyboard.dismiss();
                                setSearchQuery('');
                            }}>
                                <SvgIcon image="backArrow" />
                            </TouchableOpacity>)}
                            <View style={positionHelpers.fill}>
                                <Input
                                    ref={inputRef}
                                    inputStyles={cs.input}
                                    placeholder="Search by user"
                                    onFocus={() => setIsSearchActive(true)}
                                    onChangeText={setSearchQuery}
                                    value={searchQuery}
                                />
                            </View>
                            {!isSearchActive && (
                                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => setVisible(true)}>
                                    <SvgIcon image="menu" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>

                    {isLoading ? (
                        <LoaderIndicator />
                    ) : (
                        <FlatList
                            data={blocks}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item, index }) => (
                                <RenderBlock
                                    block={item}
                                    blockIndex={index}
                                    activeVideoIds={activeVideoIds}
                                    onVideoPress={setModalVideo}
                                    videoDuration={durations}
                                    onVideoLoad={handleVideoLoad}
                                />
                            )}
                            onViewableItemsChanged={onViewableItemsChanged.current}
                            viewabilityConfig={viewabilityConfig}
                        />
                    )}
                    {isSearchActive && (

                        <Animated.View
                            style={[
                                {
                                    ...StyleSheet.absoluteFillObject,
                                    backgroundColor: colors.black4,
                                    marginTop: inputY,
                                    paddingHorizontal: 16,
                                }, animatedOverlayStyle]}
                        >
                            {searchQuery ? (
                                <FlatList
                                    data={filteredUsers}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <BodyText
                                            paddingLeft={10}
                                            fontSize={16}
                                            color={colors.white}
                                            paddingVertical={12}
                                            borderBottomColor={colors.silver1Procent50}
                                            borderBottomWidth={1}
                                        >
                                            {item.name}
                                        </BodyText>
                                    )}


                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={[{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingHorizontal: 20,
                                            }]}>
                                                <BodyText color={colors.white} >No results found</BodyText>
                                            </View>
                                        );
                                    }}
                                    contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                                />
                            ) : (
                                <View style={positionHelpers.fillCenter}>
                                    <BodyText color={colors.white} >No results found</BodyText>
                                </View>
                            )}
                        </Animated.View>

                    )}
                </SafeAreaView >
            </View >
            {/* Modal for show videos */}
            < FullVideoModal
                modalVideo={modalVideo}
                activeVideoIds={activeVideoIds}
                onArrowPress={() => setModalVideo(null)}
                tapX={tapX}
                tapY={tapY}
                scale={scale}
                opacity={opacity}
                handleDoubleTap={(event) => handleDoubleTap(event)}

            />


            {/* MenuModal */}
            <MenuModal visible={visible} onVisible={() => setVisible(false)} />
        </>
    );
};

export default FourUScreen;

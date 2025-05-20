import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Keyboard, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming, runOnJS, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { BodyText, Input, LoaderIndicator, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';
import { generateBlocks } from '../../../../components/TabViewVideo/components/StateFeedTab/helpers/generateBlocks';
import { VideoItemType } from './types';
import { debounce } from '../../../../utils/debounce';
import RenderBlock from '../../../../components/TabViewVideo/components/StateFeedTab/components/RenderVideo';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import MenuModal from '../../../../components/Modals/MemuModal';
import { getUsersAction } from '../../../../redux/UsersRedux/usersAction';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import SearchAnimatedModal from '../../../../components/Modals/SearchAnimatedModal';
import { setMenuModal, setVideoModal } from '../../../../redux/ModalsRedux/modalSlice';
import FullVideoModal from '../../../../components/Modals/FullVideoModal';

const FourUScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector(state => state?.camera);
    const { usersData } = useReduxSelector((state: RootState) => state.users);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [durations, setDurations] = useState<Record<string, number>>({});

    //for SearchAnimatedModal
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [inputY, setInputY] = useState<number>(0);
    const overlayOpacity = useSharedValue(0);
    const overlayTranslateY = useSharedValue(0);
    //
    // const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    }, []);

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

    const debouncedSearch = useRef(
        debounce((text: string) => {
            dispatch(getUsersAction(text));
        }, 350)
    ).current;

    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery]);


    //Save duration video
    const handleVideoLoad = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
    }, []);

    // const onViewableItemsChanged = useRef(
    //     debounce(({ viewableItems }: { viewableItems: any[] }) => {
    //         const visibleIds = viewableItems.flatMap(({ item, index }) =>
    //             item.items.map((video: VideoItemType, videoIndex: number) => `${index}-${videoIndex}-${video.id}`)
    //         );
    //     }, 100)
    // );

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
                            marginBottom: isSearchActive ? 70 : 70,
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
                                    colorText={colors.white}
                                />
                            </View>
                            {!isSearchActive && (
                                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => dispatch(setMenuModal(true))}>
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
                                    videoDuration={durations}
                                    onVideoLoad={handleVideoLoad}
                                />
                            )}
                        // onViewableItemsChanged={onViewableItemsChanged.current}
                        // viewabilityConfig={viewabilityConfig}
                        />
                    )}

                </SafeAreaView >
            </View >
            {isSearchActive && (
                <SearchAnimatedModal
                    usersData={usersData}
                    searchQuery={searchQuery}
                    inputY={inputY}
                    overlayOpacity={overlayOpacity}
                    overlayTranslateY={overlayTranslateY}
                />
            )}

            {/* Video Full Modal */}
            <FullVideoModal
                onArrowPress={() => dispatch(setVideoModal(false))}
            />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default FourUScreen;

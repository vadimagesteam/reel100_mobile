import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { Input, LoaderIndicator, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';
import { generateBlocks } from '../../../../components/TabViewVideo/components/StateFeedTab/helpers/generateBlocks';
// import { VideoItemType } from './types';
import { debounce } from '../../../../utils/debounce';
import RenderBlock from '../../../../components/TabViewVideo/components/StateFeedTab/components/RenderVideo';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import MenuModal from '../../../../components/Modals/MemuModal';
import { getUsersAction } from '../../../../redux/UsersRedux/usersAction';
import SearchAnimatedModal from '../../../../components/Modals/SearchAnimatedModal';
import { setIsSearchActive, setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import FullVideoModal from '../../../../components/Modals/FullVideoModal';
import { VideoItemType } from '../../../../redux/CameraRedux/types';

const FourUScreen = () => {
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector(state => state?.camera);
    const { usersData } = useReduxSelector((state: RootState) => state.users);
    const { isSearchActive } = useReduxSelector((state: RootState) => state?.modals);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const inputRef = useRef<null | any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);

    //for SearchAnimatedModal
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
                inputRef.current.measure((height: number, pageY: number) => {
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
                        cs.container,
                    ]}
                >
                    <ScrollView contentContainerStyle={[positionHelpers.ph16]}>
                        <View style={[positionHelpers.mt10, positionHelpers.mb20, positionHelpers.alignItemsCenterRow]}>
                            {isSearchActive && (< TouchableOpacity style={cs.mr15} onPress={() => {
                                dispatch(setIsSearchActive(false));
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
                                    onFocus={() => dispatch(setIsSearchActive(true))}
                                    onChangeText={setSearchQuery}
                                    value={searchQuery}
                                    colorText={colors.white}
                                />
                            </View>
                            {!isSearchActive && (
                                <TouchableOpacity style={cs.ml15} onPress={() => dispatch(setMenuModal(true))}>
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
                                    onVideoPress={setModalVideo}
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
                modalVideo={modalVideo}
                onArrowPress={() => setModalVideo(null)}
            />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default FourUScreen;

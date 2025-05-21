import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { BodyText, LoaderIndicator, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';
import { generateBlocks } from '../../../../components/TabViewVideo/components/StateFeedTab/helpers/generateBlocks';
import RenderBlock from '../../../../components/TabViewVideo/components/StateFeedTab/components/RenderVideo';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import MenuModal from '../../../../components/Modals/MemuModal';
import SearchAnimatedModal from '../../../../components/Modals/SearchAnimatedModal';
import { setIsSearchActive, setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import FullVideoModal from '../../../../components/Modals/FullVideoModal';
import { VideoItemType } from '../../../../redux/CameraRedux/types';

const FourUScreen = () => {
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector(state => state?.camera);
    const { isSearchActive } = useReduxSelector((state: RootState) => state?.modals);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);

    // const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    }, []);


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
                            <View style={positionHelpers.fill}>
                                <TouchableOpacity style={cs.input} onPress={() => dispatch(setIsSearchActive(true))}>
                                    <BodyText color={colors.silver1Procent50}>Search by user</BodyText>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={cs.ml15} onPress={() => dispatch(setMenuModal(true))}>
                                <SvgIcon image="menu" />
                            </TouchableOpacity>
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

            {/* Search Modal */}
            <SearchAnimatedModal />

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

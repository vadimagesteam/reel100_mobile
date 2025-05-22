import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { BodyText, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';
import { generateBlocks } from '../../../../components/TabViewVideo/components/StateFeedTab/helpers/generateBlocks';
import RenderBlock from '../../../../components/TabViewVideo/components/StateFeedTab/components/RenderVideo';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import MenuModal from '../../../../components/Modals/MemuModal';
import SearchAnimatedModal from '../../../../components/Modals/SearchAnimatedModal';
import { setIsSearchActive, setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import FullVideoModal from '../../../../components/Modals/FullVideoModal';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';

const FourUScreen = () => {
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector((state: RootState) => state?.camera);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

    useEffect(() => {
        dispatch(getVideosAction());
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


    const handleRefresh = async () => {
        setRefreshing(true);

        setTimeout(async () => {
            await dispatch(getVideosAction());

            setRefreshing(false);
        }, 1000);

    };

    return (
        <>
            <View style={positionHelpers.fill}>
                <CustomHeader title="00:00:00" />
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
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={['#fff']} // Android (спінер)
                                tintColor="#fff" // iOS (спінер)
                            />
                        }
                    // onViewableItemsChanged={onViewableItemsChanged.current}
                    // viewabilityConfig={viewabilityConfig}
                    />
                </SafeAreaView >
            </View >

            {/* Search Modal */}
            <SearchAnimatedModal />

            {/* Video Full Modal */}
            <FullVideoModal
                modalVideo={modalVideo}
                setModalVideo={setModalVideo}
            />

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default FourUScreen;

import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
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
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import EmptyContent from '../../../../components/EmptyContent';

const TAKE = 15;

const FourUScreen = () => {
    const dispatch = useReduxDispatch();
    const { loading } = useReduxSelector((state: RootState) => state?.camera);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [videos, setVideos] = useState<VideoItemType[]>([]);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

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

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchVideos(true);
            setRefreshing(false);
        }, 800);
    };


    const handleLoadMore = async () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            await fetchVideos(false);
            setLoadingMore(false);
        }
    };


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
                    {loading && blocks.length === 0 ? (
                        <LoaderIndicator />
                    ) : blocks.length === 0 ? (
                        <EmptyContent />
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
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={['#fff']} // Android (спінер)
                                    tintColor="#fff" // iOS (спінер)
                                />
                            }
                            initialNumToRender={6}
                            windowSize={6}
                            maxToRenderPerBatch={6}
                            removeClippedSubviews={true}
                            // onViewableItemsChanged={onViewableItemsChanged.current}
                            // viewabilityConfig={viewabilityConfig}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loadingMore && hasMore ? <ActivityIndicator color="#fff" /> : null
                            }
                        />
                    )}
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

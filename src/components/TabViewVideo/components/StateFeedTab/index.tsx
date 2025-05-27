import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import RenderBlock from './components/RenderVideo';
import { generateBlocks } from './helpers/generateBlocks';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import FullVideoModal from '../../../Modals/FullVideoModal';
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import { VideoItemType } from '../../../../redux/CameraRedux/types';
import { LoaderIndicator } from '../../../UI';
import EmptyContent from '../../../EmptyContent';

const TAKE = 15;

const StateFeedTab = () => {
    const dispatch = useReduxDispatch();
    const { loading } = useReduxSelector((state: RootState) => state?.camera);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);

    const [refreshing, setRefreshing] = useState(false);
    const [videos, setVideos] = useState<VideoItemType[]>([]);
    const checkFileVideos = videos.filter((video) => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchVideos(true);
    }, []);

    const fetchVideos = async (reset = false) => {
        const skip = reset ? 0 : page * TAKE;

        const result = await true;
        // const result = await dispatch(getVideosAction({
        //     skip,
        //     take: TAKE,
        //     orderBy: { createdAt: 'desc' },
        // }));

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

    //Save duration video
    const handleVideoLoad = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
    }, []);

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

    return (
        <>
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
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore && hasMore ? <ActivityIndicator color="#fff" /> : null
                    }
                />
            )}

            {/* Modal for show videos */}
            <FullVideoModal
                modalVideo={modalVideo}
                setModalVideo={setModalVideo}
            />
        </>
    );
};

export default StateFeedTab;

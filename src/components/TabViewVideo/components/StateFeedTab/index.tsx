import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import { LoaderIndicator } from '../../../UI';
import RenderBlock from './components/RenderVideo';
import { VideoItemType } from './components/RenderVideo/types';
import { mockVideos } from './mockData';
import { debounce } from '../../../../utils/debounce';
import { generateBlocks } from './helpers/generateBlocks';
import FullVideoModal from './components/FullVideoModal';
import { useReduxSelector } from '../../../../store/store';

const StateFeedTab = () => {
    const { videos } = useReduxSelector(state => state?.camera);
    // const [videos] = useState(mockVideos);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [activeVideoIds, setActiveVideoIds] = useState<string[]>([]);
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [durations, setDurations] = useState<Record<string, number>>({});

    const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

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

    const onViewableItemsChanged = useRef(
        debounce(({ viewableItems }: { viewableItems: any[] }) => {
            const visibleIds = viewableItems.flatMap(({ item, index }) =>
                item.items.map((video: VideoItemType, videoIndex: number) => `${index}-${videoIndex}-${video.id}`)
            );
            setActiveVideoIds(visibleIds);
        }, 100)
    );

    return (
        <>
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

            {/* Modal for show videos */}
            <FullVideoModal
                modalVideo={modalVideo}
                activeVideoIds={activeVideoIds}
                onArrowPress={() => setModalVideo(null)}

            />
        </>
    );
};

export default StateFeedTab;

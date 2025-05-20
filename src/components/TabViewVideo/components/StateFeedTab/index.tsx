import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import RenderBlock from './components/RenderVideo';
import { generateBlocks } from './helpers/generateBlocks';
import { useReduxSelector } from '../../../../store/store';
import FullVideoModal from '../../../Modals/FullVideoModal';
import { VideoItemType } from './components/RenderVideo/types';

const StateFeedTab = () => {
    const { videos } = useReduxSelector(state => state?.camera);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [modalVideo, setModalVideo] = useState<VideoItemType | null>(null);
    // const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

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

            {/* Modal for show videos */}
            <FullVideoModal
                modalVideo={modalVideo}
                onArrowPress={() => setModalVideo(null)}
            />
        </>
    );
};

export default StateFeedTab;

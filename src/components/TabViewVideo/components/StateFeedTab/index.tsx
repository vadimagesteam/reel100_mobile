import React, { useState, useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import { LoaderIndicator } from '../../../UI';
import RenderBlock from './components/RenderVideo';
import { generateBlocks } from './helpers/generateBlocks';
// import FullVideoModal from './components/FullVideoModal';
import { useReduxDispatch, useReduxSelector } from '../../../../store/store';
import FullVideoModal from '../../../Modals/FullVideoModal';
import { setVideoModal } from '../../../../redux/ModalsRedux/modalSlice';

const StateFeedTab = () => {
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector(state => state?.camera);
    const checkFileVideos = videos.filter(video => video?.file !== null);
    const blocks = generateBlocks(checkFileVideos);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [durations, setDurations] = useState<Record<string, number>>({});
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

            {/* Modal for show videos */}
            <FullVideoModal
                onArrowPress={() => dispatch(setVideoModal(false))}
            />
        </>
    );
};

export default StateFeedTab;

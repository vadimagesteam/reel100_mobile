import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { Input, LoaderIndicator, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';
import { mockVideos } from '../../../../components/TabViewVideo/components/StateFeedTab/mockData';
import { generateBlocks } from '../../../../components/TabViewVideo/components/StateFeedTab/helpers/generateBlocks';
import { VideoItemType } from './types';
import { debounce } from '../../../../utils/debounce';
import FullVideoModal from '../../../../components/TabViewVideo/components/StateFeedTab/components/FullVideoModal';
import RenderBlock from '../../../../components/TabViewVideo/components/StateFeedTab/components/RenderVideo';

const FourUScreen = () => {
    const [videos] = useState(mockVideos);
    const blocks = generateBlocks(videos);
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
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <ScrollView contentContainerStyle={[positionHelpers.ph16]}>
                    <View style={[positionHelpers.mt10, positionHelpers.mb20, positionHelpers.alignItemsCenterRow]}>
                        <View style={positionHelpers.fill}>
                            <Input inputStyles={cs.input}
                                placeholder="Search by user" />
                        </View>
                        <TouchableOpacity onPress={() => true}>
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


            </SafeAreaView >
        </>
    );
};

export default FourUScreen;

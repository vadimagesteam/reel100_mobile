import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { cs } from './styles';
import FullVideoItem from './components/FullVideoItem';
import { formatTime } from '../../../../utils/formatTime';
import { RootState, useReduxSelector } from '../../../../store/store';

const { height } = Dimensions.get('window');

const FullVideoScreen = () => {
    const { params } = useRoute<any>();
    const { index: initialIndex } = params;
    const flatListRef = useRef(null);
    const { videos } = useReduxSelector((state: RootState) => state?.camera);
    // const validIndex = initialIndex >= 0 && initialIndex < videos.length ? initialIndex : 0;
    // const [currentIndex, setCurrentIndex] = React.useState(validIndex);
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});


    console.log('videos--FULL>>>>>', videos, initialIndex, currentIndex);
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex !== null) {
                const id = videos[currentIndex]?.id;
                if (id) {
                    setRemainingSeconds(prev => {
                        const current = prev[id];
                        if (current > 0) {
                            return {
                                ...prev,
                                [id]: current - 1,
                            };
                        }
                        return prev;
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    //Save duration video
    const handleVideoLoad = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
        setRemainingSeconds(prev => ({ ...prev, [id]: Math.floor(duration) }));
        setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
    }, []);

    //Repeat duration video
    const onVideoRepeat = useCallback((id: string) => {
        const duration = durations[id];
        if (duration) {
            setRemainingSeconds(prev => ({
                ...prev,
                [id]: Math.floor(duration),
            }));
            setVideoStartTimes(prev => ({
                ...prev,
                [id]: 0,
            }));
        }
    }, [durations]);

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            const newId = viewableItems[0].item.id;
            setCurrentIndex(newIndex);
            onVideoRepeat(newId);
        }
    }, [onVideoRepeat]);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <>
                {item.file !== null ? (
                    <FullVideoItem
                        videoUri={item.file?.storagePath}
                        videoAvatar={item?.avatar}
                        videoName={item?.fullname}
                        videoNumber={item?.list_number}
                        videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
                        onVideoLoad={(duration) => handleVideoLoad(item.id, duration)}
                        likesCount={item?.like_count}
                        paused={index === currentIndex}
                        onVideoRepeat={() => onVideoRepeat(item?.id)}
                    />
                ) : null}

            </>
        );
    };

    return (
        <View style={cs.container}>
            <FlatList
                ref={flatListRef}
                data={videos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal={false}
                pagingEnabled
                initialScrollIndex={initialIndex}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
            />
        </View>
    );
};

export default FullVideoScreen;

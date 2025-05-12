import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, TouchableOpacity, View } from 'react-native';
import { BodyText, SvgIcon } from '../../UI';
import { colors, positionHelpers } from '../../../styles';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../store/store';
import { onLogout } from '../../../redux/AuthRedux/authSlice';
import { useNavigation } from '@react-navigation/native';
import { DASHBOARD_ROUTES } from '../../../navigation/routes';
import FullVideoItem from '../../../screens/Dashboard/Main/FullVideo/components/FullVideoItem';
import { formatTime } from '../../../utils/formatTime';


interface FullVideoScrollModalProps {
    visible: boolean,
    onVisible: (val: boolean) => void
    selectedId: string | null
}

const { height } = Dimensions.get('window');

const FullVideoScrollModal = ({ visible, onVisible, selectedId }: FullVideoScrollModalProps) => {
    const navigation = useNavigation();
    const dispatch = useReduxDispatch();
    const flatListRef = useRef(null);
    const { videos } = useReduxSelector((state: RootState) => state?.camera);
    // const validIndex = initialIndex >= 0 && initialIndex < videos.length ? initialIndex : 0;
    // const [currentIndex, setCurrentIndex] = React.useState(validIndex);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
    const [isReady, setIsReady] = useState<boolean>(false);


    useEffect(() => {
        if (!selectedId || !videos.length) { return; }

        const index = videos.findIndex((v) => v.id === selectedId);
        if (index !== -1) {
            setCurrentIndex(index);
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index, animated: false });
            }, 100);
        }
    }, [selectedId, videos]);

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
                {item.file !== null && Math.abs(index - currentIndex) <= 1 ? (
                    <FullVideoItem
                        videoUri={item.file?.storagePath}
                        videoAvatar={item?.avatar}
                        videoName={item?.fullname}
                        videoNumber={item?.list_number}
                        videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
                        onVideoLoad={(duration) => {
                            setIsReady(true);
                            handleVideoLoad(item.id, duration);
                        }}
                        likesCount={item?.like_count}
                        // paused={index === currentIndex}
                        paused={index === currentIndex}
                        // paused={index !== currentIndex}
                        onVideoRepeat={() => onVideoRepeat(item?.id)}
                    />
                ) : null}

            </>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={visible}
            onRequestClose={onVisible}
        >
            <View style={{
                flex: 1,
                backgroundColor: colors.black4,
                justifyContent: 'center',
            }}>
                {!isReady && (
                    <ActivityIndicator size="large" color="#fff" style={{ position: 'absolute', top: '50%', left: '50%' }} />
                )}
                <FlatList
                    ref={flatListRef}
                    data={videos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={3}
                    windowSize={5}
                    getItemLayout={(_, index) => ({
                        length: height,
                        offset: height * index,
                        index,
                    })}
                    // initialScrollIndex={selectedId}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onScrollToIndexFailed={({ index }) => {
                        setTimeout(() => {
                            flatListRef.current?.scrollToIndex({ index, animated: false });
                        }, 100);
                    }}

                />
            </View>
        </Modal>
    );
};

export default FullVideoScrollModal;

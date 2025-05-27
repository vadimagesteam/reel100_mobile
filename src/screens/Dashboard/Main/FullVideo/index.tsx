import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import Video from 'react-native-video';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { GestureDetector } from 'react-native-gesture-handler';
import { RootState, useReduxDispatch, useReduxSelector } from '../../../../store/store';
import { useSharedValue } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const FullVideoScreen = ({ route }) => {
    const navigation = useNavigation<any>();
    const dispatch = useReduxDispatch();
    const { countComments } = useReduxSelector((state: RootState) => state.video);
    const { likesData } = useReduxSelector((state: RootState) => state.likes);
    const { user } = useReduxSelector((state: RootState) => state.auth);
    const videoRef = useRef<any | null>(null);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
    const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);

    const [showComments, setShowComments] = useState<boolean>(false);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const tapX = useSharedValue(0);
    const tapY = useSharedValue(0);

    const { videos, initialIndex } = route.params;
    const isFocused = useIsFocused();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);


    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    // Ensure scroll to correct index on mount
    useEffect(() => {
        if (flatListRef.current && initialIndex != null) {
            flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
        }
    }, [initialIndex]);

    const getItemLayout = (_: any, index: number) => ({
        length: height,
        offset: height * index,
        index,
    });

    return (
        <FlatList
            ref={flatListRef}
            data={videos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
                const isActive = index === currentIndex && isFocused;
                return (
                    <>
                        <GestureDetector gesture={doubleTapGesture}>
                            <View
                                style={[positionHelpers.fill, { backgroundColor: colors.black }]}

                            >
                                {isVideoLoading && (
                                    <LoaderIndicator />
                                )}
                                {modalVideo?.file?.storagePath && (
                                    <>
                                        <Video
                                            key={modalVideo?.id}
                                            ref={videoRef}
                                            source={{ uri: modalVideo?.file?.storagePath }}
                                            style={positionHelpers.fill}
                                            resizeMode="cover"
                                            muted={false}
                                            repeat
                                            paused={false}
                                            controls={false}
                                            onLoad={(data) => {
                                                handleVideoLoadModal(modalVideo?.id, data?.duration);
                                                setIsVideoLoading(false);

                                                setTimeout(() => {
                                                    videoRef.current?.seek(0);
                                                }, 100);
                                            }}
                                            onProgress={({ currentTime }) => {
                                                if (modalVideo?.id && durations[modalVideo.id]) {
                                                    const duration = durations[modalVideo.id];
                                                    setRemainingSeconds(prev => {
                                                        const newRemaining = duration - currentTime;
                                                        if (Math.abs((prev[modalVideo.id] ?? 0) - newRemaining) > 0.25) {
                                                            return {
                                                                ...prev,
                                                                [modalVideo.id]: newRemaining,
                                                            };
                                                        }
                                                        return prev;
                                                    });

                                                    if (currentTime >= duration) {
                                                        videoRef.current?.seek(0);
                                                        onVideoRepeat(modalVideo.id);
                                                    }
                                                }
                                            }}
                                        />
                                        <VideoAbsoluteInfo
                                            videoCheck={'FULL'}
                                            showArrow={true}
                                            onArrowBack={() => {
                                                setModalVideo(null);
                                                setShowComments(false);
                                            }}
                                            onNameClick={() => {
                                                if (user?.id !== modalVideo.user.id) {
                                                    dispatch(getOneUserAction(modalVideo.user.id));
                                                    navigation.navigate(DASHBOARD_ROUTES.USER_PROFILE_SCREEN, { idUser: modalVideo.user.id });
                                                    setModalVideo(null);
                                                }
                                            }}
                                            avatar={''}
                                            name={`${modalVideo?.user?.firstName} ${modalVideo?.user?.lastName}`}
                                            likeCheck={likesData.some(like => like?.user?.id === user?.id)}
                                            likesCount={likesData.length}
                                            videoDuration={formatTime(modalVideo ? remainingSeconds[modalVideo.id] ?? 0 : 0)}
                                            openComments={openComments}
                                            showComments={true}
                                            countComments={countComments}
                                        />
                                        {showComments && modalVideo?.id && (
                                            <CommentSection videoId={modalVideo.id} userId={modalVideo.user.id} onClose={() => setShowComments(false)} />
                                        )}
                                    </>
                                )}
                            </View>
                        </GestureDetector>

                        {/* Heart animation */}
                        <Animated.Text style={[positionHelpers.absolute, cs.animatedLike, animatedStyle]}>❤️</Animated.Text>
                    </>
                );
            }}
            getItemLayout={getItemLayout}
            pagingEnabled
            snapToInterval={height}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialScrollIndex={initialIndex}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
        />
    );
};

export default FullVideoScreen;


// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { View, Dimensions, FlatList, ActivityIndicator, InteractionManager } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { cs } from './styles';
// import FullVideoItem from './components/FullVideoItem';
// import { formatTime } from '../../../../utils/formatTime';
// import { RootState, useReduxSelector } from '../../../../store/store';
// import { debounce } from '../../../../utils/debounce';

// const { height } = Dimensions.get('window');
// const screenWidth = Dimensions.get('window').width;
// const videoHeight = screenWidth / 0.5625;


// const FullVideoScreen = () => {
//     const { params } = useRoute<any>();
//     const { selectedId, index: initialIndex } = params;
//     const flatListRef = useRef(null);
//     const { videos } = useReduxSelector((state: RootState) => state?.camera);
//     // const validIndex = initialIndex >= 0 && initialIndex < videos.length ? initialIndex : 0;
//     // const [currentIndex, setCurrentIndex] = React.useState(validIndex);
//     const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
//     const [_, setVideoStartTimes] = useState<Record<string, number>>({});
//     const [durations, setDurations] = useState<Record<string, number>>({});
//     const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
//     const [isReady, setIsReady] = useState<boolean>(false);

//     const [listReady, setListReady] = useState(false);
//     const [layoutHeight, setLayoutHeight] = useState(0);

//     const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
//     console.log('videos--FULL>>>>>', videos, selectedId);

//     // useEffect(() => {
//     //     if (!selectedId || !videos.length || layoutHeight === 0) { return; }

//     //     const index = videos.findIndex((v) => v.id === selectedId);
//     //     if (index === -1) { return; }

//     //     setCurrentIndex(index);

//     //     InteractionManager.runAfterInteractions(() => {
//     //         setTimeout(() => {
//     //             flatListRef.current?.scrollToIndex({ index, animated: false });
//     //             setListReady(true); // тільки тепер рендеримо відео
//     //         }, 300);
//     //     });
//     // }, [selectedId, videos, layoutHeight]);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (currentIndex !== null) {
//                 const id = videos[currentIndex]?.id;
//                 if (id) {
//                     setRemainingSeconds(prev => {
//                         const current = prev[id];
//                         if (current > 0) {
//                             return {
//                                 ...prev,
//                                 [id]: current - 1,
//                             };
//                         }
//                         return prev;
//                     });
//                 }
//             }
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentIndex]);

//     const reorderedVideos = useMemo(() => {
//         if (!selectedId) { return videos; }

//         const index = videos.findIndex(video => video.id === selectedId);
//         if (index === -1) { return videos; }

//         return [...videos.slice(index), ...videos.slice(0, index)];
//     }, [videos, selectedId]);

//     const idToOriginalIndex = useMemo(() => {
//         const map: Record<string, number> = {};
//         videos.forEach((v, i) => {
//             map[v.id] = i;
//         });
//         return map;
//     }, [videos]);

//     //Save duration video
//     const handleVideoLoad = useCallback((id: string, duration: number) => {
//         setDurations(prev => ({ ...prev, [id]: duration }));
//         setRemainingSeconds(prev => ({ ...prev, [id]: Math.floor(duration) }));
//         setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
//     }, []);

//     //Repeat duration video
//     const onVideoRepeat = useCallback((id: string) => {
//         const duration = durations[id];
//         if (duration) {
//             setRemainingSeconds(prev => ({
//                 ...prev,
//                 [id]: Math.floor(duration),
//             }));
//             setVideoStartTimes(prev => ({
//                 ...prev,
//                 [id]: 0,
//             }));
//         }
//     }, [durations]);

//     const onViewableItemsChanged = useRef(
//         debounce(({ viewableItems }: { viewableItems: any[] }) => {
//             const newIndex = viewableItems[0].index;
//             const newId = viewableItems[0].item.id;
//             // const visibleIds = viewableItems.flatMap(({ item, index }) =>
//             //     item.items.map((video: any, videoIndex: number) => `${index}-${videoIndex}-${video.id}`)
//             // );
//             setCurrentIndex(newIndex);
//             onVideoRepeat(newId);
//         }, 100)
//     );


//     // const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
//     //     if (viewableItems.length > 0) {
//     //         const newIndex = viewableItems[0].index;
//     //         const newId = viewableItems[0].item.id;
//     //         setCurrentIndex(newIndex);
//     //         onVideoRepeat(newId);
//     //     }
//     // }, [onVideoRepeat]);

//     // const viewabilityConfig = {
//     //     itemVisiblePercentThreshold: 50,
//     // };

//     const renderItem = ({ item, index }: { item: any, index: number }) => {
//         if (!listReady) { return null; } // рендеримо тільки коли список готовий

//         const isFocused = index !== currentIndex;
//         return (
//             <>
//                 {item.file !== null && Math.abs(index - currentIndex) <= 1 ? (
//                     <FullVideoItem
//                         videoUri={item.file?.storagePath}
//                         videoAvatar={item?.avatar}
//                         videoName={item?.fullname}
//                         videoNumber={item?.list_number}
//                         videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
//                         onVideoLoad={(duration) => {
//                             setIsReady(true);
//                             handleVideoLoad(item.id, duration);
//                         }}
//                         likesCount={item?.like_count}
//                         // paused={index === currentIndex}
//                         // paused={index === currentIndex}
//                         paused={!isFocused}
//                         // paused={index !== currentIndex}
//                         onVideoRepeat={() => onVideoRepeat(item?.id)}
//                     />
//                 ) : null}

//             </>
//         );
//     };

//     return (
//         <View style={cs.container} onLayout={(e) => {
//             setLayoutHeight(e.nativeEvent.layout.height); // визначаємо height
//         }}>
//             {/* <FlatList
//                 ref={flatListRef}
//                 data={videos}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 horizontal={false}
//                 pagingEnabled
//                 // initialScrollIndex={initialIndex}
//                 onViewableItemsChanged={onViewableItemsChanged}
//                 viewabilityConfig={viewabilityConfig}
//                 showsVerticalScrollIndicator={false}
//                 getItemLayout={(_, index) => ({
//                     length: height,
//                     offset: height * index,
//                     index,
//                 })}
//             /> */}
//             {!isReady && (
//                 <ActivityIndicator size="large" color="#fff" style={{ position: 'absolute', top: '50%', left: '50%' }} />
//             )}
//             <FlatList
//                 ref={flatListRef}
//                 data={reorderedVideos}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 pagingEnabled
//                 showsVerticalScrollIndicator={false}
//                 initialNumToRender={3}
//                 windowSize={5}
//                 getItemLayout={(_, index) => ({
//                     length: height,
//                     offset: height * index,
//                     index,
//                 })}

//                 // // initialScrollIndex={selectedId}
//                 // onViewableItemsChanged={idToOriginalIndex}
//                 onViewableItemsChanged={onViewableItemsChanged.current}
//                 viewabilityConfig={viewabilityConfig}
//                 onScrollToIndexFailed={({ index }) => {
//                     setTimeout(() => {
//                         flatListRef.current?.scrollToIndex({ index, animated: false });
//                     }, 100);
//                 }}

//             />

//         </View>
//     );
// };

// export default FullVideoScreen;

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { View, FlatList, ActivityIndicator, useWindowDimensions, InteractionManager } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { cs } from './styles';
// import FullVideoItem from './components/FullVideoItem';
// import { formatTime } from '../../../../utils/formatTime';
// import { RootState, useReduxSelector } from '../../../../store/store';
// import { debounce } from '../../../../utils/debounce';

// const FullVideoScreen = () => {
//     const { params } = useRoute<any>();
//     const { selectedId } = params;
//     const flatListRef = useRef<FlatList>(null);
//     const { videos } = useReduxSelector((state: RootState) => state?.camera);

//     const [currentIndex, setCurrentIndex] = useState<number>(0);
//     const [videoStartTimes, setVideoStartTimes] = useState<Record<string, number>>({});
//     const [durations, setDurations] = useState<Record<string, number>>({});
//     const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});
//     const [isReady, setIsReady] = useState(false);
//     const [listReady, setListReady] = useState(false);
//     const [layoutHeight, setLayoutHeight] = useState(0);
//     const { height } = useWindowDimensions();

//     const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

//     // Find the initial index of the selected video
//     const initialIndex = useMemo(() => {
//         return selectedId ? videos.findIndex((v) => v.id === selectedId) : 0;
//     }, [selectedId, videos]);

//     // Scroll to the selected video after measuring the layout
//     useEffect(() => {
//         if (!videos.length || layoutHeight === 0) { return; }

//         const validIndex = initialIndex >= 0 && initialIndex < videos.length ? initialIndex : 0;
//         setCurrentIndex(validIndex);

//         InteractionManager.runAfterInteractions(() => {
//             setTimeout(() => {
//                 // Calculate the offset based on the index
//                 const offset = validIndex * height;
//                 flatListRef.current?.scrollToOffset({ offset, animated: false });
//                 setListReady(true);
//             }, 300);
//         });
//     }, [initialIndex, videos, layoutHeight]);

//     // Handle video load to set the video duration and remaining seconds
//     const handleVideoLoad = useCallback((id: string, duration: number) => {
//         setDurations(prev => ({ ...prev, [id]: duration }));
//         setRemainingSeconds(prev => ({ ...prev, [id]: Math.floor(duration) }));
//         setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
//     }, []);

//     // Handle video repeat action by resetting the remaining time
//     const onVideoRepeat = useCallback((id: string) => {
//         const duration = durations[id];
//         if (duration) {
//             setRemainingSeconds(prev => ({ ...prev, [id]: Math.floor(duration) }));
//             setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
//         }
//     }, [durations]);

//     // Viewable items changed handler with debouncing
//     const onViewableItemsChanged = useRef(
//         debounce(({ viewableItems }: { viewableItems: any[] }) => {
//             if (viewableItems.length > 0) {
//                 const newIndex = viewableItems[0].index ?? 0;
//                 setCurrentIndex(newIndex);
//             }
//         }, 100)
//     );

//     const renderItem = ({ item, index }: { item: any; index: number }) => {
//         if (!listReady) { return null; }

//         const isFocused = index !== currentIndex;
//         return (
//             item.file && Math.abs(index - currentIndex) <= 1 && (
//                 <FullVideoItem
//                     videoUri={item.file?.storagePath}
//                     videoAvatar={item?.avatar}
//                     videoName={item?.fullname}
//                     videoNumber={item?.list_number}
//                     videoDuration={formatTime(remainingSeconds[item.id] ?? 0)}
//                     onVideoLoad={(duration) => {
//                         setIsReady(true);
//                         handleVideoLoad(item.id, duration);
//                     }}
//                     likesCount={item?.like_count}
//                     paused={!isFocused}
//                     onVideoRepeat={() => onVideoRepeat(item?.id)}
//                 />
//             )
//         );
//     };

//     return (
//         <View style={cs.container} onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}>
//             {!isReady && (
//                 <ActivityIndicator
//                     size="large"
//                     color="#fff"
//                     style={{ position: 'absolute', top: '50%', left: '50%' }}
//                 />
//             )}

//             <FlatList
//                 ref={flatListRef}
//                 data={videos}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 pagingEnabled
//                 showsVerticalScrollIndicator={false}
//                 initialNumToRender={3}
//                 windowSize={5}
//                 initialScrollIndex={currentIndex}
//                 getItemLayout={(_, index) => ({
//                     length: height,
//                     offset: height * index,
//                     index,
//                 })}
//                 onViewableItemsChanged={onViewableItemsChanged.current}
//                 viewabilityConfig={viewabilityConfig}
//                 onScrollToIndexFailed={({ index }) => {
//                     setTimeout(() => {
//                         flatListRef.current?.scrollToOffset({ offset: index * height, animated: false });
//                     }, 100);
//                 }}
//             />
//         </View>
//     );
// };

// export default FullVideoScreen;


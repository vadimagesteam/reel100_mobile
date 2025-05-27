// VideoItemComponent.tsx
import React, { ReactNode, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import { GestureDetector } from 'react-native-gesture-handler';
import { VideoItemType } from '../../../../../../redux/CameraRedux/types';

type VideoItemContentProps = {
    item: VideoItemType;
    isActive: boolean;
    videoHeight: number;
    onLoad: (data: { duration: number }) => void;
    onProgress: (data: { currentTime: number }) => void;
    gesture: any;
    renderOverlay: () => ReactNode;
};

const VideoItemContent = ({
    item,
    isActive,
    videoHeight,
    onLoad,
    onProgress,
    gesture,
    renderOverlay,
}: VideoItemContentProps) => {
    const videoRef = useRef<any>(null);

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.seek(0);
        }
    }, [isActive]);

    return (
        <GestureDetector gesture={gesture}>
            <View style={{ height: videoHeight, backgroundColor: 'black' }}>
                <Video
                    ref={videoRef}
                    source={{ uri: item.file?.storagePath }}
                    paused={!isActive}
                    resizeMode="cover"
                    repeat
                    muted
                    onLoad={onLoad}
                    onProgress={onProgress}
                    style={{ height: videoHeight, width: '100%' }}
                />
                {renderOverlay()}
            </View>
        </GestureDetector>
    );
};

export default VideoItemContent;

// import React, { useEffect, useRef, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import Video from 'react-native-video';
// import { GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
// import { positionHelpers } from '../../../../../../styles';
// import { LoaderIndicator } from '../../../../../UI';
// import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';


// interface VideoItemProps {
//     source: string;
//     isActive: boolean;
//     videoHeight: number;
//     tapX: any;
//     tapY: any;
//     scale: any;
//     opacity: any;

//     avatar: string;
//     name: string;
//     videoNumber: number;
//     videoDuration: string | number;
//     videoId: string;
//     userId: string | undefined;
//     setRemainingSeconds: any
//     onVideoLoad: (duration: number) => void;
//     likesCount: number;
//     myId: string | undefined;
//     durations: any,

//     onVideoRepeat?: () => void;
//     onNameClick?: () => void;
// }

// const VideoItem: React.FC<VideoItemProps> = ({
//     source,
//     isActive,
//     videoHeight,
//     tapX,
//     tapY,
//     scale,
//     opacity,
//     avatar,
//     name,
//     myId,
//     videoId,
//     userId,
//     videoNumber,
//     videoDuration,
//     setRemainingSeconds,
//     onVideoLoad,
//     likesCount,
//     durations,
//     onVideoRepeat,
//     onNameClick,
// }) => {
//     const videoRef = useRef<any>(null);
//     const [isVideoLoading, setIsVideoLoading] = useState(true);

//     console.log('isVideoLoading--->', isVideoLoading);
//     useEffect(() => {
//         if (isActive && videoRef.current) {
//             videoRef.current.seek(0);
//         }
//     }, [isActive]);

//     const handleDoubleTap = (x: number, y: number) => {
//         if (!videoId || !myId) { return; }

//         tapX.value = x;
//         tapY.value = y;

//         scale.value = 1;
//         opacity.value = 1;

//         scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
//             scale.value = withTiming(0, { duration: 500 });
//             opacity.value = withTiming(0, { duration: 500 });
//         });

//         // Лайки логіку сюди, якщо потрібно
//     };

//     const animatedStyle = useAnimatedStyle(() => ({
//         left: tapX.value - 40,
//         top: tapY.value - 40,
//         opacity: opacity.value,
//         transform: [{ scale: scale.value }],
//     }));

//     const doubleTapGesture = Gesture.Tap()
//         .numberOfTaps(2)
//         .onEnd((event) => {
//             runOnJS(handleDoubleTap)(event.x, event.y);
//         });

//     const gesture = Gesture.Exclusive(doubleTapGesture);

//     return (
//         <GestureDetector gesture={gesture}>
//             <View style={positionHelpers.fill}>
//                 <View style={[positionHelpers.center, { height: videoHeight, backgroundColor: 'black' }]}>
//                     {isVideoLoading && (
//                         <View style={[positionHelpers.absoluteCenter]}>
//                             <LoaderIndicator />
//                         </View>
//                     )}
//                     <Video
//                         key={videoId}
//                         ref={videoRef}
//                         source={{ uri: source }}
//                         style={[{ height: videoHeight, width: '100%' }]}
//                         resizeMode="cover"
//                         repeat
//                         muted
//                         paused={!isActive}
//                         // onLoad={(data) => {
//                         //     console.log('Video loaded:', videoId);

//                         //     onVideoLoad(Math.floor(data.duration));
//                         //     setIsVideoLoading(false);
//                         // }}
//                         // onEnd={() => {
//                         //     videoRef.current?.seek(0);
//                         //     onVideoRepeat?.();
//                         // }}

//                         onLoad={(data) => {
//                             onVideoLoad(data?.duration);
//                             setIsVideoLoading(false);

//                             setTimeout(() => {
//                                 videoRef.current?.seek(0);
//                             }, 100);
//                         }}
//                         onProgress={({ currentTime }) => {
//                             if (videoId && durations[videoId]) {
//                                 const duration = durations[videoId];
//                                 setRemainingSeconds(prev => {
//                                     const newRemaining = duration - currentTime;
//                                     if (Math.abs((prev[videoId] ?? 0) - newRemaining) > 0.25) {
//                                         return {
//                                             ...prev,
//                                             [videoId]: newRemaining,
//                                         };
//                                     }
//                                     return prev;
//                                 });

//                                 if (currentTime >= duration) {
//                                     videoRef.current?.seek(0);
//                                     onVideoRepeat?.();
//                                 }
//                             }
//                         }}
//                     />
//                 </View>

//                 <VideoAbsoluteInfo
//                     avatar={avatar}
//                     name={name}
//                     videoNumber={videoNumber}
//                     videoDuration={videoDuration}
//                     showLike={false}
//                     onNameClick={onNameClick}
//                 />

//                 <Animated.Text style={[animatedStyle, { position: 'absolute', fontSize: 50 }]}>❤️</Animated.Text>
//             </View>
//         </GestureDetector>
//     );
// };

// export default VideoItem;


// import React, { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, StyleSheet, View } from 'react-native';
// import Video from 'react-native-video';
// import { GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { runOnJS, SharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
// import { positionHelpers } from '../../../../../../styles';
// import { cs } from './styles';
// import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
// import { getOneUserAction } from '../../../../../../redux/UsersRedux/usersAction';
// import { RootState, useReduxDispatch, useReduxSelector } from '../../../../../../store/store';
// import { deleteLikeAction, getLikesAction, setLikeAction } from '../../../../../../redux/LikesRedux/likesAction';

// interface VideoItemProps {
//     source: string;
//     isActive: boolean
//     videoHeight: number
//     tapX: SharedValue<number>
//     tapY: SharedValue<number>
//     scale: SharedValue<number>
//     opacity: SharedValue<number>

//     avatar: string;
//     name: string;
//     videoNumber: number;
//     videoDuration: string | number;
//     videoId: string
//     userId: string | undefined
//     onVideoLoad: (duration: number) => void;
//     likesCount: number;
//     myId: string | undefined

//     onVideoRepeat?: () => void;
//     onNameClick?: () => void
//     onFirstVideoLoaded?: () => void
//     // onVideoPress?: () => void
// }

// const VideoItem: React.FC<VideoItemProps> = ({
//     source,
//     isActive = false,
//     videoHeight,
//     tapX,
//     tapY,
//     scale,
//     opacity,
//     avatar,
//     name,
//     myId,
//     videoId,
//     userId,
//     videoNumber,
//     videoDuration,
//     onVideoLoad,
//     likesCount,
//     onVideoRepeat,
//     onNameClick,
//     onFirstVideoLoaded,
// }) => {
//     const dispatch = useReduxDispatch();
//     const { likesData } = useReduxSelector((state: RootState) => state.likes);
//     const videoRef = useRef<any | null>(null);
//     const [isLoaded, setIsLoaded] = useState<boolean>(false);
//     // const doubleTapRef = useRef<TapGestureHandler>(null);

//     useEffect(() => {
//         if (isActive && videoRef.current) {
//             videoRef.current.seek(0);
//         }
//     }, [isActive]);

//     // useEffect(() => {
//     //     dispatch(getLikesAction({ userId: userId, videoId: videoId }));
//     // }, []);

//     // Animated style heart
//     const animatedStyle = useAnimatedStyle(() => ({
//         // position: 'absolute',
//         left: tapX.value - 40,
//         top: tapY.value - 40,
//         // left: tapPosition.x,
//         // top: tapPosition.y,
//         opacity: opacity.value,
//         transform: [{ scale: scale.value }],
//     }));


//     const handleSingleTap = (e: { x: number; y: number }) => {
//         // const index = allVideo.findIndex((video: any) => video.id === videoId);

//         // if (index !== -1) {
//         // navigation.navigate(DASHBOARD_ROUTES.FULL_VIDEO_SCREEN as never, {
//         //     selectedId: videoId,
//         //     index,
//         // } as never);
//         // }
//     };

//     const handleDoubleTap = (x: number, y: number) => {
//         if (!videoId || !myId) { return; }

//         tapX.value = x;
//         tapY.value = y;

//         scale.value = 1;
//         opacity.value = 1;

//         scale.value = withSpring(1.2, { damping: 5, stiffness: 100 }, () => {
//             scale.value = withTiming(0, { duration: 500 });
//             opacity.value = withTiming(0, { duration: 500 });
//         });

//         // const likesBodyData = {
//         //     dataLike: {
//         //         typeField: 'Like',
//         //         user: { id: myId },
//         //         video: { id: videoId },
//         //     },
//         //     userId: userId,
//         // };

//         // const existingUserLike = likesData.find(like => like?.user?.id === myId);

//         // if (existingUserLike) {
//         //     dispatch(deleteLikeAction({ id: existingUserLike.id, userId: myId, videoId: videoId }));
//         // } else {
//         //     dispatch(setLikeAction(likesBodyData));
//         // }
//     };


//     const doubleTapGesture = Gesture.Tap()
//         .numberOfTaps(2)
//         .onEnd((event) => {
//             if (event && videoId && userId) {
//                 runOnJS(handleDoubleTap)(event.x, event.y);
//             }
//         });



//     const singleTap = Gesture.Tap()
//         .numberOfTaps(1)
//         .onEnd((e) => {
//             runOnJS(handleSingleTap)(e);
//         });


//     const gesture = Gesture.Exclusive(doubleTapGesture, singleTap);


//     return (
//         <GestureDetector gesture={gesture}>
//             <View style={positionHelpers.fill}>
//                 {/* {!isLoaded && isActive && (
//                     <View style={{
//                         ...StyleSheet.absoluteFillObject,
//                         backgroundColor: 'black',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         zIndex: 10,
//                     }}>
//                         <ActivityIndicator color="white" size="large" />
//                     </View>
//                 )} */}
//                 <View style={[positionHelpers.center, cs.videoWrapper]}>
//                     <Video
//                         ref={videoRef}
//                         source={{ uri: source }}
//                         style={[
//                             cs.video,
//                             { height: videoHeight },
//                         ]}
//                         resizeMode="cover"
//                         repeat
//                         muted
//                         paused={!isActive}
//                         onLoad={(data) => {
//                             // setIsLoaded(true);
//                             onVideoLoad(Math.floor(data.duration));
//                             onFirstVideoLoaded?.();
//                         }}
//                         onEnd={() => {
//                             videoRef.current?.seek(0);
//                             onVideoRepeat?.();
//                         }}
//                     // onProgress={({ currentTime }) => {
//                     //     if (modalVideo?.id && durations[modalVideo.id]) {
//                     //         const duration = durations[modalVideo.id];
//                     //         setRemainingSeconds(prev => {
//                     //             const newRemaining = duration - currentTime;
//                     //             if (Math.abs((prev[modalVideo.id] ?? 0) - newRemaining) > 0.25) {
//                     //                 return {
//                     //                     ...prev,
//                     //                     [modalVideo.id]: newRemaining,
//                     //                 };
//                     //             }
//                     //             return prev;
//                     //         });

//                     //         if (currentTime >= duration) {
//                     //             videoRef.current?.seek(0);
//                     //             onVideoRepeat(modalVideo.id);
//                     //         }
//                     //     }
//                     // }}

//                     />
//                 </View>
//                 <VideoAbsoluteInfo
//                     avatar={avatar}
//                     name={name}
//                     videoNumber={videoNumber}
//                     videoDuration={videoDuration}
//                     showLike={false}
//                     // likesCount={likesData.length}
//                     // likeCheck={likesData.some(like => like?.user?.id === myId)}
//                     onNameClick={onNameClick}
//                 />

//                 {/* Heart animation */}
//                 <Animated.Text style={[cs.heart, animatedStyle]}>❤️</Animated.Text>
//             </View>
//         </GestureDetector>
//     );
// };

// export default VideoItem;

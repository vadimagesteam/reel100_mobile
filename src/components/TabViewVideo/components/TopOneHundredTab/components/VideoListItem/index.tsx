import React from 'react';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { formatTime } from '../../../../../../utils/formatTime';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
import VideoItemContent from '../VideoItemContent';
import { positionHelpers } from '../../../../../../styles';
import { StyleSheet } from 'react-native';
import { VideoItemType } from '../../../../../../redux/CameraRedux/types';
import { ExclusiveGesture } from 'react-native-gesture-handler';
import { LikeResponseType } from '../../../../../../redux/LikesRedux/types';

export interface VideoListItemProps {
    item: VideoItemType;
    index: number;
    isActive: boolean;
    videoHeight: number;
    gesture: ExclusiveGesture;
    durations: { [key: string]: number };
    setDurations: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    setTimeLefts: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    likesData: LikeResponseType[];
    likeCheck: boolean;
    timeLeft: number;
    animatedStyle: AnimatedStyle;
}

export const VideoListItem = ({
    item,
    index,
    isActive,
    videoHeight,
    gesture,
    durations,
    setDurations,
    setTimeLefts,
    likesData,
    likeCheck,
    timeLeft,
    animatedStyle,
}: VideoListItemProps) => (
    <>
        <VideoItemContent
            item={item}
            isActive={isActive}
            videoHeight={videoHeight}
            onLoad={(data) => setDurations(prev => ({ ...prev, [item.id]: data.duration }))}
            onProgress={({ currentTime }) => {
                if (isActive) {
                    const duration = durations[item.id] || 0;
                    setTimeLefts(prev => ({ ...prev, [item.id]: Math.floor(duration - currentTime) }));
                }
            }}
            gesture={gesture}
            renderOverlay={() => (
                <VideoAbsoluteInfo
                    avatar={''}
                    name={`${item?.user?.firstName} ${item?.user?.lastName}`}
                    videoDuration={formatTime(timeLeft)}
                    likeCheck={likeCheck}
                    likesCount={likesData.length}
                    videoNumber={index + 1}
                />
            )}
        />
        <Animated.Text style={[positionHelpers.absolute, cs.animatedHeart, animatedStyle]}>❤️</Animated.Text>
    </>
);

const cs = StyleSheet.create({
    animatedHeart: {
        fontSize: 35,
    },
});

export default VideoListItem;

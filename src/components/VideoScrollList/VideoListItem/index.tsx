import React from 'react';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { formatTime } from '../../../utils/formatTime';
import VideoAbsoluteInfo from '../../VideoAbsoluteInfo';
import VideoItemContent from './../VideoItemContent';
import { positionHelpers } from '../../../styles';
import { StyleSheet, View } from 'react-native';
import { VideoItemType } from '../../../redux/CameraRedux/types';
import { LikeResponseType } from '../../../redux/LikesRedux/types';

export interface VideoListItemProps {
    item: VideoItemType;
    index: number;
    isActive: boolean;
    videoHeight: number;
    gesture: any;
    durations: { [key: string]: number };
    setTimeLefts: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    likesData: LikeResponseType[];
    likeCheck: boolean;
    timeLeft: number;

    videoCheck?: 'FULL' | 'SIMPLE' | undefined
    openComments?: () => void
    showComments?: boolean
    countComments?: number
    showArrow?: boolean
    onArrowBack?: () => void
    onNameClick?: () => void
    onLoad: (data: any) => void
    showShare?: boolean
    animatedStyle: AnimatedStyle;
    paused?: boolean
    muted?: boolean
}

export const VideoListItem = ({
    item,
    index,
    isActive,
    videoHeight,
    gesture,
    durations,
    setTimeLefts,
    likesData,
    likeCheck,
    timeLeft,
    videoCheck,
    openComments,
    showComments,
    countComments,
    showArrow,
    onArrowBack,
    onNameClick,
    onLoad,
    showShare,
    animatedStyle,
    paused,
    muted,
}: VideoListItemProps) => (
    <>
        <VideoItemContent
            item={item}
            isActive={isActive}
            paused={paused}
            muted={muted}
            videoHeight={videoHeight}
            onLoad={onLoad}
            onProgress={({ currentTime }) => {
                if (isActive) {
                    const duration = durations[item.id] || 0;
                    setTimeLefts(prev => ({ ...prev, [item.id]: Math.floor(duration - currentTime) }));
                }
            }}
            gesture={gesture}
            renderOverlay={() => (
                <VideoAbsoluteInfo
                    videoCheck={videoCheck}
                    avatar={''}
                    name={`${item?.user?.firstName} ${item?.user?.lastName}`}
                    videoDuration={formatTime(timeLeft)}
                    likeCheck={likeCheck}
                    likesCount={likesData.length}
                    videoNumber={index + 1}
                    openComments={openComments}
                    showComments={showComments}
                    countComments={countComments}
                    showArrow={showArrow}
                    onArrowBack={onArrowBack}
                    onNameClick={onNameClick}
                    showShare={showShare}
                    paused={paused}
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

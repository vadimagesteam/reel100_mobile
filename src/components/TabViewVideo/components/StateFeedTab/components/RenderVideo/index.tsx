import React, { useRef } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
import { formatTwoTime } from '../../../../../../utils/formatTime';
import { cs } from './styles';
import { BlockType, VideoItemType } from './types';

const screenWidth = Dimensions.get('window').width;
const half = screenWidth / 2;

type RenderBlockProps = {
    block: BlockType;
    blockIndex: number;
    activeVideoIds: string[];
    onVideoPress: (video: VideoItemType) => void;
    videoDuration: Record<string, number>;
    onVideoLoad: (id: string, duration: number) => void;
};

const RenderBlock = ({
    block,
    blockIndex,
    activeVideoIds,
    onVideoPress,
    videoDuration,
    onVideoLoad,
}: RenderBlockProps) => {
    const videoRef = useRef<any | null>(null);
    const { type, items } = block;

    const renderVideo = (item: any, style: any, uniqueKey: string) => {
        const duration = videoDuration[item.id];

        return (
            <TouchableOpacity onPress={() => onVideoPress(item)} key={uniqueKey}>
                <Video
                    ref={videoRef}
                    source={{ uri: item.uri }}
                    style={style}
                    resizeMode="cover"
                    muted
                    repeat
                    paused={!activeVideoIds.includes(uniqueKey)}
                    onLoad={(data) => onVideoLoad(item.id, Math.floor(data.duration))}
                    onEnd={() => {
                        videoRef.current?.seek(0);
                    }}
                />
                <VideoAbsoluteInfo
                    justInfo="SIMPLE"
                    avatar={item?.avatar}
                    name={item?.fullname}
                    videoDuration={`${formatTwoTime(duration)}s`}
                    likesCount={item?.like_count}
                />
            </TouchableOpacity>
        );
    };

    if (type === 'leftSmall_rightBig') {
        return (
            <View style={cs.blockRow}>
                <View>
                    {renderVideo(items[0], cs.smallBox, `${blockIndex}-0-${items[0].id}`)}
                    {renderVideo(items[1], cs.smallBox, `${blockIndex}-1-${items[1].id}`)}
                </View>
                {renderVideo(items[4], cs.bigBox, `${blockIndex}-4-${items[4].id}`)}
            </View>
        );
    }

    if (type === 'leftBig_rightSmall') {
        return (
            <View style={cs.blockRow}>
                {renderVideo(items[0], cs.bigBox, `${blockIndex}-0-${items[0].id}`)}
                <View>
                    {renderVideo(items[3], cs.smallBox, `${blockIndex}-3-${items[3].id}`)}
                    {renderVideo(items[4], cs.smallBox, `${blockIndex}-4-${items[4].id}`)}
                </View>
            </View>
        );
    }

    // single fallback
    return renderVideo(
        items[0],
        { width: screenWidth, height: half },
        `${blockIndex}-0-${items[0].id}`
    );
};

export default RenderBlock;

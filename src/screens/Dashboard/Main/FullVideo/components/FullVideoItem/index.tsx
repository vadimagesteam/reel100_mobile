import React, { useEffect, useRef } from 'react';
import Video from 'react-native-video';
import { cs } from '../../styles';
import VideoAbsoluteInfo from '../../../../../../components/VideoAbsoluteInfo';

interface FullVideoItemProps {
    videoUri: string
    videoAvatar: string
    videoName: string
    videoNumber: string | number
    videoDuration: string | number;
    onVideoLoad: (duration: number) => void;
    likesCount: number | string;
    paused: boolean
    onVideoRepeat?: () => void;
}

const FullVideoItem = ({
    videoUri,
    videoAvatar,
    videoName,
    videoNumber,
    videoDuration,
    onVideoLoad,
    likesCount,
    paused,
    onVideoRepeat,
}: FullVideoItemProps) => {
    const videoRef = useRef<any | null>(null);

    useEffect(() => {
        if (paused && videoRef.current) {
            videoRef.current.seek(0);
        }
    }, [paused]);

    return (
        <>
            <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={cs.video}
                resizeMode="cover"
                repeat
                paused={!paused}
                onLoad={(data) => {
                    onVideoLoad(Math.floor(data.duration));
                }}
                onEnd={() => {
                    videoRef.current?.seek(0);
                    onVideoRepeat?.();
                }}
            />
            <VideoAbsoluteInfo
                showArrow={true}
                showChat={true}
                showReplay={true}
                videoCheck={'FULL'}
                avatar={videoAvatar}
                name={videoName}
                videoNumber={videoNumber}
                videoDuration={videoDuration}
                likesCount={likesCount}
            />
        </>
    );
};

export default FullVideoItem;

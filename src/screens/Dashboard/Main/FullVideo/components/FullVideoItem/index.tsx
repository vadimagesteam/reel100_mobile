import React, { memo, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { cs } from '../../styles';
import VideoAbsoluteInfo from '../../../../../../components/VideoAbsoluteInfo';
import { Dimensions, View } from 'react-native';

const { height, width } = Dimensions.get('window');

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

const FullVideoItem = memo(({
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
    const navigation = useNavigation();
    const videoRef = useRef<any | null>(null);
    const [aspectRatio, setAspectRatio] = useState(16 / 9); // Початкове значення

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
                // style={cs.video}
                // style={{ width: '100%', height: '100%' }}
                // resizeMode={'contain'}
                // style={{ width: '100%', aspectRatio: 0.5625 }}
                style={{

                    // aspectRatio: 7 / 16,


                    width: '100%',
                    // aspectRatio: videoWidth / videoHeight,
                    // width: '100%',
                    height: '100%',
                }}
                resizeMode="cover"
                repeat
                paused={!paused}
                onLoad={(data) => {
                    // const { width, height } = data.naturalSize;
                    // if (width && height) {
                    //     setAspectRatio(width / height);
                    //     console.log('Video aspectRatio:', width / height);
                    // }
                    onVideoLoad(Math.floor(data?.duration));
                }}
                onEnd={() => {
                    videoRef.current?.seek(0);
                    onVideoRepeat?.();
                }}
            />
            <VideoAbsoluteInfo
                showArrow={true}
                onArrowBack={() => navigation.goBack()}
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
});

export default FullVideoItem;

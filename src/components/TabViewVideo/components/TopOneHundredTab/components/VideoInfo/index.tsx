import React from 'react';
import { Image, View } from 'react-native';
import { BodyText } from '../../../../../UI';
import { colors, positionHelpers } from '../../../../../../styles';
import { cs } from './styles';

interface VideoInfoProps {
    avatar: string;
    name: string;
    videoNumber: number;
    videoDuration: string | number;
    likesCount: number;
}

const VideoInfo = ({ avatar, name, videoNumber, videoDuration, likesCount }: VideoInfoProps) => {
    return (
        <>
            <View style={[positionHelpers.absolute, positionHelpers.alignItemsCenterRow, cs.containerName]}>
                {avatar === '' ? (
                    <View style={cs.noAvatar} />
                ) : (
                    <Image source={{ uri: avatar }} style={cs.avatar} />
                )}
                <BodyText fontWeight={'bold'} color={colors.white} paddingLeft={5}>{name}</BodyText>
            </View>


            <View style={[positionHelpers.absolute, positionHelpers.alignEnd, positionHelpers.flexRow, cs.containerDuration]}>
                <View style={cs.videoNumberContainer}>
                    <BodyText color={colors.white}>#{videoNumber}</BodyText>
                </View>
                <View style={cs.videoDurationContainer}>
                    <BodyText color={colors.white}>{videoDuration}</BodyText>
                </View>
            </View>

            {/* Likes */}
            <View style={[positionHelpers.absolute, positionHelpers.alignCenter, cs.containerLikes]}>
                <View style={[positionHelpers.alignCenter, cs.likeCountContainer]}>
                    <BodyText fontSize={16} fontWeight={'bold'} color={colors.white}>{likesCount}</BodyText>
                </View>
            </View>
        </>
    );
};

export default VideoInfo;

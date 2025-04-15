import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BodyText, SvgIcon } from '../UI';
import { colors, positionHelpers } from '../../styles';
import { cs } from './styles';
import { useNavigation } from '@react-navigation/native';


interface VideoAbsoluteInfoProps {
    videoCheck?: 'FULL' | 'SIMPLE'
    avatar: string;
    name: string;
    videoNumber: number | string;
    videoDuration: string | number;
    likesCount: number | string;

    showArrow?: boolean
    showChat?: boolean
    showReplay?: boolean
    fullLike?: boolean
}

const VideoAbsoluteInfo = ({
    videoCheck,
    avatar,
    name,
    videoNumber,
    videoDuration,
    likesCount,
    showArrow = false,
    showChat = false,
    showReplay = false,
    fullLike = false,
}: VideoAbsoluteInfoProps) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    return (
        <>
            {showArrow && (<TouchableOpacity
                style={[positionHelpers.absolute, positionHelpers.alignItemsCenterRow, cs.containerName, { top: videoCheck === 'FULL' ? insets.top + 1 : 10, padding: 10 }]}
                onPress={() => navigation.goBack()}
            >
                <SvgIcon image="backArrow" />
            </TouchableOpacity>)}
            <View style={[positionHelpers.absolute, positionHelpers.alignItemsCenterRow, cs.containerName, { top: videoCheck === 'FULL' ? insets.top + 40 : 10 }]}>
                {avatar === '' ? (
                    <View style={cs.noAvatar} />
                ) : (
                    <Image source={{ uri: avatar }} style={cs.avatar} />
                )}
                <BodyText fontWeight={'700'} color={colors.white} paddingLeft={5}>{name}</BodyText>
            </View>


            <View style={[positionHelpers.absolute, positionHelpers.alignEnd, positionHelpers.flexRow, cs.containerDuration, { top: videoCheck === 'FULL' ? insets.top + 45 : 15 }]}>
                <View style={cs.videoNumberContainer}>
                    <BodyText color={colors.white}>#{videoNumber}</BodyText>
                </View>
                <View style={cs.videoDurationContainer}>
                    <BodyText color={colors.white}>{videoDuration}</BodyText>
                </View>
            </View>

            {/* Likes */}
            {fullLike ? (
                <View style={[positionHelpers.absolute, positionHelpers.rowCenter, cs.containerLikes]}>
                    {showChat && (
                        <TouchableOpacity style={[positionHelpers.alignCenter, cs.circleButton]}>
                            <SvgIcon image="eyeShow" color={colors.white} />
                        </TouchableOpacity>
                    )}

                    <View style={[positionHelpers.alignCenter, cs.likeCountContainer]}>
                        <BodyText fontSize={16} fontWeight={'bold'} color={colors.white}>{likesCount}</BodyText>
                    </View>
                    {showReplay && (
                        <TouchableOpacity style={[positionHelpers.alignCenter, cs.circleButton]}>
                            <SvgIcon image="eyeShow" color={colors.white} />
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={[positionHelpers.absolute, cs.containerLikes, cs.left10]}>
                    <View style={[positionHelpers.flexRow]}>
                        <SvgIcon image="like_heart" />
                        <BodyText fontSize={16} fontWeight={'700'} color={colors.white}>{likesCount}</BodyText>
                    </View>
                </View>
            )}

        </>
    );
};

export default VideoAbsoluteInfo;

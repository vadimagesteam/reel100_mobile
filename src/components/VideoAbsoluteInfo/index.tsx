import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BodyText, SvgIcon } from '../UI';
import { colors, positionHelpers } from '../../styles';
import { cs } from './styles';


interface VideoAbsoluteInfoProps {
    justInfo?: 'FULL' | 'SIMPLE'
    videoCheck?: 'FULL' | 'SIMPLE'
    avatar?: string;
    name?: string;
    videoNumber?: number | string;
    videoDuration?: string | number;
    likeCheck?: boolean
    likesCount?: number | string;

    showArrow?: boolean
    onArrowBack?: () => void
    onNameClick?: () => void
    showChat?: boolean
    showReplay?: boolean
    fullLike?: boolean
    showLike?: boolean
    showComments?: boolean
    showShare?: boolean
    countComments?: number | null
    paused?: boolean
    openComments?: () => void
    onShare?: () => void
}

const VideoAbsoluteInfo = ({
    justInfo = 'FULL',
    videoCheck,
    avatar,
    name,
    videoNumber,
    videoDuration,
    likeCheck,
    likesCount,
    showArrow = false,
    onArrowBack,
    onNameClick,
    showChat = false,
    showReplay = false,
    fullLike = false,
    showComments = false,
    showShare = false,
    showLike = true,
    countComments,
    paused,
    openComments,
    onShare,
}: VideoAbsoluteInfoProps) => {
    const insets = useSafeAreaInsets();
    const videoCheckFull = videoCheck === 'FULL';

    return (
        <>
            {justInfo === 'FULL' ? (
                <>
                    {
                        paused && (
                            <View style={cs.playContainer}>
                                <SvgIcon image="playIcon" color="white" style={cs.iconPlayStyle} />
                            </View>
                        )
                    }
                    {showArrow && (<TouchableOpacity
                        style={[positionHelpers.absolute, positionHelpers.alignItemsCenterRow, cs.containerName, { top: videoCheckFull ? insets.top + 1 : 10, padding: 10 }]}
                        onPress={onArrowBack}
                    >
                        <SvgIcon image="backArrow" />
                    </TouchableOpacity>)}
                    <TouchableOpacity
                        style={[positionHelpers.absolute, positionHelpers.alignItemsCenterRow, cs.containerName, { top: videoCheckFull ? insets.top + 40 : 10 }]}
                        onPress={onNameClick}
                    >
                        {avatar === '' ? (
                            <View style={cs.noAvatar} />
                        ) : (
                            <Image source={{ uri: avatar }} style={cs.avatar} />
                        )}
                        <BodyText fontWeight={'700'} color={colors.white} paddingLeft={5}>{name}</BodyText>
                    </TouchableOpacity>


                    <View style={[positionHelpers.absolute, positionHelpers.alignEnd, positionHelpers.flexRow, cs.containerDuration, { top: videoCheckFull ? insets.top + 45 : 15 }]}>
                        {videoNumber && (<View style={cs.videoNumberContainer}>
                            <BodyText color={colors.white}>#{videoNumber}</BodyText>
                        </View>
                        )}
                        <View style={cs.videoDurationContainer}>
                            <BodyText color={colors.white}>{videoDuration}</BodyText>
                        </View>
                        {
                            showComments && (
                                <View style={[positionHelpers.absolute, positionHelpers.alignCenter, cs.containerChat]}>
                                    <TouchableOpacity onPress={openComments} >
                                        <SvgIcon image="commentIcon" color={colors.white} style={cs.iconStyle24} />
                                    </TouchableOpacity>
                                    <BodyText fontWeight={'bold'} fontSize={14} color={colors.white}>{countComments}</BodyText>
                                </View>
                            )
                        }
                        {
                            showShare && (
                                <TouchableOpacity style={[positionHelpers.absolute, positionHelpers.alignCenter, cs.containerShare]} onPress={onShare} >
                                    <SvgIcon image="shareIcon" color={colors.white} style={cs.iconStyle24} />
                                </TouchableOpacity>
                            )
                        }

                    </View>



                    {/* Likes */}
                    {showLike && (
                        <>
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
                                <View style={[positionHelpers.absolute, cs.containerLikes, cs.left16]}>
                                    <View style={[positionHelpers.flexRow]}>
                                        <SvgIcon image={likeCheck ? 'like_red_heart' : 'like_heart'} style={cs.iconFillLike} />
                                        <BodyText fontSize={16} fontWeight={'700'} color={colors.white} marginLeft={2}>{likesCount}</BodyText>
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                </>
            ) : (
                <>
                    <View style={positionHelpers.absolute}>
                        <View style={[positionHelpers.flexRow, positionHelpers.alignCenter, cs.containerNameSimple]}>
                            {avatar === '' ? (
                                <View style={cs.noAvatarSimple} />
                            ) : (
                                <Image source={{ uri: avatar }} style={cs.avatarSimple} />
                            )}
                            <BodyText fontSize={12} fontWeight={'700'} color={colors.white} paddingLeft={5} numberOfLines={1} maxWidth={100}>{name}</BodyText>
                        </View>
                    </View>
                    <View style={[positionHelpers.absolute, positionHelpers.alignEnd, positionHelpers.flexRow, cs.containerDurationSimple]}>
                        <BodyText fontSize={13} fontWeight={'700'} color={colors.white}>{videoDuration}</BodyText>
                    </View>
                    <View style={[positionHelpers.absolute, positionHelpers.flexRow, cs.likeContainerSimple]}>
                        <SvgIcon image="like_heart" />
                        <BodyText fontSize={16} fontWeight={'700'} color={colors.white}>{likesCount}</BodyText>
                    </View>
                </>
            )
            }

        </>
    );
};

export default VideoAbsoluteInfo;

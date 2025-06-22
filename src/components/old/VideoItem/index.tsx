import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BodyText } from '../UI';
import { colors, positionHelpers } from '../../../styles';
import VideoAbsoluteInfo from '../VideoAbsoluteInfo';
import { formatTwoTime } from '../../../utils/formatTime.ts';

interface VideoItemProps {
    item?: any
    itemFourU?: any
    user?: any
    screenshot?: any
    isLastInRow?: boolean
    ITEM_SIZE?: number
    onVideoPress?: () => void
    variantProp?: 'profile' | 'fourU'

    //fourU
    fullname?: string | undefined
    duration?: number | undefined
    fourUStyle?: any
    fourUScreenshot?: string
}


const VideoItem = ({
    user,
    item,
    itemFourU,
    screenshot,
    isLastInRow,
    ITEM_SIZE,
    onVideoPress,
    variantProp = 'profile',
    fullname,
    duration,
    fourUStyle,
    fourUScreenshot,
}: VideoItemProps) => {
    return (
        <>
            {variantProp ? (
                <TouchableOpacity
                    style={[{
                        width: ITEM_SIZE,
                        marginRight: isLastInRow ? 0 : 4,
                    }, cs.container]}
                    onPress={onVideoPress}
                // onPress={() => setModalVideo(item)}
                >
                    {screenshot ? (
                        <>
                            <FastImage
                                style={{ width: '100%', height: '100%', borderRadius: 5 }}
                                source={{
                                    uri: screenshot,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <VideoAbsoluteInfo
                                justInfo="SIMPLE"
                                avatar={''}
                                name={`${user?.firstName} ${user?.lastName}`}
                                // videoDuration={`${formatTwoTime(duration)}s`}
                                likesCount={item?.like_count}
                            />
                        </>
                    ) : (
                        <View style={[positionHelpers.center, cs.noPreviewStyle]}>
                            <BodyText fontSize={10} color={colors.white}>No preview</BodyText>
                        </View>
                    )}

                </TouchableOpacity>
            ) : (
                <>
                    {fourUScreenshot ? (
                        <>
                            <FastImage
                                style={fourUStyle}
                                source={{
                                    uri: fourUScreenshot,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <VideoAbsoluteInfo
                                justInfo="SIMPLE"
                                avatar={''}
                                name={fullname}
                                videoDuration={`${formatTwoTime(duration)}s`}
                                likesCount={itemFourU?.like_count}
                            />
                        </>
                    ) : (
                        <View style={[positionHelpers.center, cs.noPreviewStyle]}>
                            <BodyText fontSize={10} color={colors.white}>No preview</BodyText>
                        </View>
                    )}
                </>
            )}
        </>
    );
};

const cs = StyleSheet.create({
    container: {
        height: 150,
        marginBottom: 4,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: colors.black,
    },
    noPreviewStyle: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.black,
        borderRadius: 8,
    },
});

export default VideoItem;

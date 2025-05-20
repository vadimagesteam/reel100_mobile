import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
// import { formatTwoTime } from '../../../../../../utils/formatTime';
import { cs } from './styles';
import { BlockType, VideoItemType } from './types';
import FastImage from 'react-native-fast-image';
import { BodyText } from '../../../../../UI';
import { colors, positionHelpers } from '../../../../../../styles';

const { width: screenWidth } = Dimensions.get('window');
const half = screenWidth / 2;

type RenderBlockProps = {
    block: BlockType;
    blockIndex: number;
    videoDuration: Record<string, number>;
    onVideoPress: (video: VideoItemType) => void;
    onVideoLoad: (id: string, duration: number) => void;
};

const RenderBlock = ({
    block,
    blockIndex,
    onVideoPress,
    // videoDuration,
}: RenderBlockProps) => {
    const { type, items } = block;

    const renderVideo = (item: any, style: any, uniqueKey: string) => {
        const screenshot = item?.file?.variation?.[0]?.screenshots?.[0];

        return (
            <TouchableOpacity onPress={() => onVideoPress(item)}
                key={uniqueKey}
            >
                {screenshot !== undefined ? (
                    <>
                        <FastImage
                            style={style}
                            source={{
                                uri: screenshot,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <VideoAbsoluteInfo
                            justInfo="SIMPLE"
                            avatar={item?.avatar}
                            name={item?.fullname}
                            // videoDuration={`${formatTwoTime(duration)}s`}
                            likesCount={item?.like_count}

                        />
                    </>
                ) : (
                    <View
                        style={[style, positionHelpers.center, { backgroundColor: colors.black1 }]}>
                        <BodyText fontSize={10} color={colors.white}>No preview</BodyText>
                    </View>
                )}
            </TouchableOpacity >
        );
    };

    const renderBlock = (items: any[]) => {
        if (type === 'leftSmall_rightBig') {
            return (
                <View style={cs.blockRow}>
                    <View>
                        {items.slice(0, 2).map((item, index) =>
                            renderVideo(item, cs.smallBox, `${blockIndex}-${index}-${item.id}`)
                        )}
                    </View>
                    {items[2] && renderVideo(items[2], cs.bigBox, `${blockIndex}-2-${items[2].id}`)}
                </View>
            );
        }

        if (type === 'leftBig_rightSmall') {
            return (
                <View style={cs.blockRow}>
                    {renderVideo(items[0], cs.bigBox, `${blockIndex}-0-${items[0].id}`)}
                    <View>
                        {items.slice(1, 3).map((item, index) =>
                            renderVideo(item, cs.smallBox, `${blockIndex}-${index + 1}-${item.id}`)
                        )}
                    </View>
                </View>
            );
        }

        return (
            <View style={{ margin: 10 }}>
                {renderVideo(
                    items[0],
                    // { width: screenWidth - 20, height: (screenWidth - 20) * 0.6 },
                    { width: screenWidth, height: half },
                    `${blockIndex}-fallback-${items[0].id}`
                )}
            </View>
        );
    };

    return renderBlock(items);
};

export default RenderBlock;

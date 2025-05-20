import React, { useRef } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
import { formatTwoTime } from '../../../../../../utils/formatTime';
import { cs } from './styles';
import { BlockType } from './types';
import { useReduxDispatch } from '../../../../../../store/store';
import { getOneVideoAction } from '../../../../../../redux/VideoRedux/videoAction';
import { setVideoModal } from '../../../../../../redux/ModalsRedux/modalSlice';
import FastImage from 'react-native-fast-image';
import { BodyText } from '../../../../../UI';
import { colors, positionHelpers } from '../../../../../../styles';

const { width: screenWidth } = Dimensions.get('window');
const half = screenWidth / 2;

type RenderBlockProps = {
    block: BlockType;
    blockIndex: number;
    videoDuration: Record<string, number>;
    onVideoLoad: (id: string, duration: number) => void;
};

const RenderBlock = ({
    block,
    blockIndex,
    videoDuration,
}: RenderBlockProps) => {
    const dispatch = useReduxDispatch();
    const { type, items } = block;

    const renderVideo = (item: any, style: any, uniqueKey: string) => {
        const screenshot = item?.file?.variation?.[0]?.screenshots?.[0];

        return (
            <TouchableOpacity onPress={() => {
                dispatch(getOneVideoAction(item?.id));
                dispatch(setVideoModal(true));
            }}
                key={uniqueKey}
            >
                {screenshot !== undefined ? (
                    <>
                        <FastImage
                            style={style}
                            // style={{ width: '100%', height: '100%', borderRadius: 5 }}
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
// const screenWidth = Dimensions.get('window').width;
// const half = screenWidth / 2;

// type RenderBlockProps = {
//     block: BlockType;
//     blockIndex: number;
//     videoDuration: Record<string, number>;
//     onVideoLoad: (id: string, duration: number) => void;
// };

// const RenderBlock = ({
//     block,
//     blockIndex,
//     videoDuration,
// }: RenderBlockProps) => {
//     const dispatch = useReduxDispatch();
//     const videoRef = useRef<any | null>(null);
//     const { type, items } = block;

//     const renderVideo = (item: any, style: any, uniqueKey: string) => {
//         const duration = videoDuration[item.id];
//         const screenshot =
//             item.file?.variation?.[0]?.screenshots?.[0];

//         return (
//             <TouchableOpacity onPress={() => {
//                 dispatch(getOneVideoAction(item?.id));
//                 dispatch(setVideoModal(true));
//             }}
//                 key={uniqueKey}
//             >
//                 {item.file !== null ? (
//                     <>
//                         {screenshot !== undefined ? (
//                             <>
//                                 <FastImage
//                                     style={style}
//                                     // style={{ width: '100%', height: '100%', borderRadius: 5 }}
//                                     source={{
//                                         uri: screenshot,
//                                         priority: FastImage.priority.normal,
//                                         cache: FastImage.cacheControl.immutable,
//                                     }}
//                                     resizeMode={FastImage.resizeMode.cover}
//                                 />
//                                 <VideoAbsoluteInfo
//                                     justInfo="SIMPLE"
//                                     avatar={item?.avatar}
//                                     name={item?.fullname}
//                                     // videoDuration={`${formatTwoTime(duration)}s`}
//                                     likesCount={item?.like_count}
//                                 />
//                             </>
//                         ) : (
//                             <View
//                                 style={[style, positionHelpers.center, { backgroundColor: colors.black1 }]}>
//                                 <BodyText fontSize={10} color={colors.white}>No preview</BodyText>
//                             </View>
//                         )}

//                     </>
//                 ) : <></>}
//             </TouchableOpacity>
//         );
//     };

//     if (type === 'leftSmall_rightBig') {
//         return (
//             <View style={cs.blockRow}>
//                 <View>
//                     {renderVideo(items[0], cs.smallBox, `${blockIndex}-0-${items[0].id}`)}
//                     {renderVideo(items[1], cs.smallBox, `${blockIndex}-1-${items[1].id}`)}
//                 </View>
//                 {renderVideo(items[4], cs.bigBox, `${blockIndex}-4-${items[4].id}`)}
//             </View>
//         );
//     }

//     if (type === 'leftBig_rightSmall') {
//         return (
//             <View style={cs.blockRow}>
//                 {renderVideo(items[0], cs.bigBox, `${blockIndex}-0-${items[0].id}`)}
//                 <View>
//                     {renderVideo(items[3], cs.smallBox, `${blockIndex}-3-${items[3].id}`)}
//                     {renderVideo(items[4], cs.smallBox, `${blockIndex}-4-${items[4].id}`)}
//                 </View>
//             </View>
//         );
//     }

//     // single fallback
//     return renderVideo(
//         items[0],
//         { width: screenWidth, height: half },
//         `${blockIndex}-0-${items[0].id}`
//     );
// };

// export default RenderBlock;

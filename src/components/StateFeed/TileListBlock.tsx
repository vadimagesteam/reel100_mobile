import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TileBlock } from './helpers/generateBlocks.ts';
import { VideoPost } from '../VideoFeed/queries/apiVideosFetcher.ts';
import VideoAbsoluteInfo from '../old/VideoAbsoluteInfo';
import { positionHelpers } from '../../styles';
import { colors } from '../../theme/colors.ts';

const { width: screenWidth } = Dimensions.get('window');
const half = screenWidth / 2;

export interface RenderBlockProp<T = TileBlock<VideoPost>> {
  item: T;
  index: number;
  onVideoPress: (video: VideoPost) => void;
}

const renderVideo = (
  onVideoPress: RenderBlockProp['onVideoPress'],
  item: VideoPost,
  style: any,
  uniqueKey: string,
) => {
  const screenshot = item?.file?.variation?.[0]?.screenshots?.[0];
  const fullName = `${item?.user?.firstName} ${item?.user?.lastName}`;

  return (
    <TouchableOpacity onPress={() => onVideoPress(item)} key={uniqueKey}>
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
            avatar={''}
            name={fullName}
            // videoDuration={`${formatTwoTime(duration)}s`}
            likesCount={item?.likesCount}
          />
        </>
      ) : (
        <View style={[style, positionHelpers.center, { backgroundColor: colors.black1 }]}>
          <Text className="text-[10px] text-white">No preview</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const TileListBlock = ({
  item: block,
  index: blockIndex,
  onVideoPress,
}: RenderBlockProp) => {
  const { type, items } = block;

  if (type === 'leftSmall_rightBig') {
    return (
      <View className="mb-[2px] flex-row">
        <View>
          {items
            .slice(0, 2)
            .map((item, index) =>
              renderVideo(onVideoPress, item, cs.smallBox, `${blockIndex}-${index}-${item.id}`),
            )}
        </View>
        {items[2] &&
          renderVideo(onVideoPress, items[2], cs.bigBox, `${blockIndex}-2-${items[2].id}`)}
      </View>
    );
  }

  if (type === 'leftBig_rightSmall') {
    return (
      <View className="mb-[2px] flex-row">
        {renderVideo(onVideoPress, items[0], cs.bigBox, `${blockIndex}-0-${items[0].id}`)}
        <View>
          {items
            .slice(1, 3)
            .map((item, index) =>
              renderVideo(onVideoPress, item, cs.smallBox, `${blockIndex}-${index + 1}-${item.id}`),
            )}
        </View>
      </View>
    );
  }

  return (
    <View className="m-[10px]">
      {renderVideo(
        onVideoPress,
        items[0],
        // { width: screenWidth - 20, height: (screenWidth - 20) * 0.6 },
        { width: screenWidth, height: half },
        `${blockIndex}-fallback-${items[0].id}`,
      )}
    </View>
  );
};

export const cs = StyleSheet.create({
  smallBox: {
    width: half,
    height: half,
    margin: 1,
  },
  bigBox: {
    width: half,
    height: half * 2,
    margin: 3,
  },
  margin10: {
    margin: 10,
  },
});

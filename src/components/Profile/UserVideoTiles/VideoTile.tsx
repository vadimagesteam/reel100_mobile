import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BaseTileItemProps } from '../../VideoTiles/VideoTiles.tsx';
import { VideoPost } from '../../VideoFeed/queries/apiVideosFetcher.ts';
import FastImage from 'react-native-fast-image';
import VideoAbsoluteInfo from '../../old/VideoAbsoluteInfo';
import { colors, positionHelpers } from '../../../styles';
import { BodyText } from '../../old/UI';
import React from 'react';
import { TileConfig } from './tileConfig.ts';

export const VideoTile = ({ item, onVideoPress, index }: BaseTileItemProps<VideoPost>) => {
  const isLastInRow = (index + 1) % TileConfig.NumColumns === 0;
  const screenshot = item.file?.variation?.[0]?.screenshots?.[0] ?? null;
  const { user } = item;
  return (
    <TouchableOpacity
      style={[
        {
          width: TileConfig.ItemSize,
          marginRight: isLastInRow ? 0 : 4,
        },
        cs.container,
      ]}
      onPress={() => onVideoPress(item)}
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
            likesCount={item?.likesCount}
          />
        </>
      ) : (
        <View style={[positionHelpers.center, cs.noPreviewStyle]}>
          <BodyText fontSize={10} color={colors.white}>
            No preview
          </BodyText>
        </View>
      )}
    </TouchableOpacity>
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

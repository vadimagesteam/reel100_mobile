import { Text, TouchableOpacity, View } from 'react-native';
import { BaseTileItemProps } from '../../videoTiles/VideoTiles.tsx';
import { VideoPost } from '../../videoFeed/queries/apiVideosFetcher.ts';
import FastImage from 'react-native-fast-image';
import VideoAbsoluteInfo from '../../old/VideoAbsoluteInfo';
import React from 'react';
import { TileConfig } from './tileConfig.ts';

export const VideoTile = ({ item, onVideoPress, index }: BaseTileItemProps<VideoPost>) => {
  const isLastInRow = (index + 1) % TileConfig.NumColumns === 0;
  const screenshot = item.file?.variation?.[0]?.screenshots?.[0] ?? null;
  const { user } = item;
  return (
    <TouchableOpacity
      className="mb-1 h-[150px] overflow-hidden rounded-[8px] bg-black"
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          width: TileConfig.ItemSize,
          marginRight: isLastInRow ? 0 : 4,
        },
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
          {['InProcess', 'Pending'].includes(item.status) && (
            <View className="absolute size-full items-center justify-center bg-black/80">
              <Text className="text-[12px] font-black text-blue3">Processing</Text>
            </View>
          )}
        </>
      ) : (
        <View className="size-full items-center justify-center rounded-[8px] bg-black">
          <Text className="text-[10px] text-white">No preview</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

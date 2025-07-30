import clsx from 'clsx';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TileConfig } from './tileConfig';
import type { VideoPost } from '../videoFeed/queries/apiVideosFetcher';
import { VideoInfoOverlay } from './VideoInfoOverlay';

export interface VideoTileProps<ItemType = VideoPost>
  extends Omit<TouchableOpacityProps, 'onPress'> {
  item: ItemType;
  onVideoPress: (video: VideoPost, index: number) => void;
  rowSize?: number;
  index: number;
  className?: string;
  width?: number;
}

export const VideoTile = ({
  item,
  className,
  style,
  onVideoPress,
  rowSize,
  index,
  width = TileConfig.ItemSize,
}: VideoTileProps<VideoPost>) => {
  const screenshot = item.file?.variation?.[0]?.screenshots?.[0] ?? null;
  const lastInRow = rowSize && index !== undefined && (index + 1) % rowSize === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx(
        'relative mb-1 h-[150px] overflow-hidden rounded-[8px]',
        !lastInRow && 'mr-[4px]',
        className,
      )}
      style={[{ width }, style]}
      onPress={() => onVideoPress(item, index)}
    >
      {screenshot ? (
        <>
          <FastImage
            className="size-full"
            source={{
              uri: screenshot,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <VideoInfoOverlay video={item} />
          {['InProcess', 'Pending'].includes(item.status) && (
            <View className="absolute size-full items-center justify-center bg-black/80">
              <Text className="text-[12px] font-black text-blue3">Processing</Text>
            </View>
          )}
        </>
      ) : (
        <View className="size-full items-center justify-center rounded-[8px] bg-black">
          <Text className="text-[10px] text-primary">No preview</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

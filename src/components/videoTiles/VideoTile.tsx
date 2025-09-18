import clsx from 'clsx';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { FadeIn } from 'react-native-reanimated';
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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
  const isProcessing = ['InProcess', 'Pending'].includes(item.status);
  const isBanned = item.status === 'Banned';

  return (
    <AnimatedTouchable
      entering={FadeIn.delay(20 * Math.min(index, 10))}
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
          {(isBanned || isProcessing) && (
            <View className="absolute size-full items-center justify-center bg-black/80">
              {isProcessing && (
                <Text className="text-[12px] font-black text-blue3">Processing</Text>
              )}
              {isBanned && <Text className="text-[12px] font-black text-red3">BANNED</Text>}
            </View>
          )}
        </>
      ) : (
        <View className="size-full items-center justify-center rounded-[8px] bg-black">
          {isProcessing ? (
            <Text className="text-[12px] font-black text-blue3">Processing</Text>
          ) : isBanned ? (
            <Text className="text-[12px] font-black text-red3">BANNED</Text>
          ) : (
            <Text className="text-[10px] text-primary">No preview</Text>
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
};

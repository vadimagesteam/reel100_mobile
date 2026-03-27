import clsx from 'clsx';
import { Alert, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import Ionicons from '@react-native-vector-icons/ionicons';
import { TileConfig } from './tileConfig';
import type { VideoPost } from '../videoFeed/queries/apiVideosFetcher';
import { VideoInfoOverlay } from './VideoInfoOverlay';
import { colors } from '../../theme';

export interface VideoTileProps<ItemType = VideoPost>
  extends Omit<TouchableOpacityProps, 'onPress'> {
  item: ItemType;
  onVideoPress: (video: VideoPost, index: number) => void;
  onDeletePress?: (video: VideoPost) => void;
  allowDelete?: boolean;
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
  onDeletePress,
  allowDelete,
  rowSize,
  index,
  width = TileConfig.ItemSize,
}: VideoTileProps<VideoPost>) => {
  const screenshot = item.file?.variation?.[0]?.screenshots?.[0] ?? null;
  const lastInRow = rowSize && index !== undefined && (index + 1) % rowSize === 0;
  const isProcessing = ['InProcess', 'Pending'].includes(item.status);
  const isBanned = item.status === 'Banned';
  const canDelete = allowDelete && !isProcessing && !isBanned && !screenshot && onDeletePress;

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
          {canDelete && (
            <TouchableOpacity
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
              hitSlop={10}
              onPress={(e) => {
                e.stopPropagation();
                Alert.alert('Delete this video?', 'This action cannot be undone', [
                  { style: 'cancel', text: 'Cancel' },
                  {
                    style: 'destructive',
                    text: 'Delete',
                    onPress: () => onDeletePress(item),
                  },
                ]);
              }}
            >
              <Ionicons name="trash-bin-outline" size={18} color={colors.red} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
};

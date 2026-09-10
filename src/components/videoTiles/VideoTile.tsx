import clsx from 'clsx';
import { ActivityIndicator, Alert, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import Ionicons from '@react-native-vector-icons/ionicons';
import { TileConfig } from './tileConfig';
import type { VideoPost, VideoProcessingStep } from '../videoFeed/queries/apiVideosFetcher';
import { VideoInfoOverlay } from './VideoInfoOverlay';
import { colors } from '../../theme';
import { CircleIconButton } from '../ui';

const processingSteps: { key: VideoProcessingStep; label: string }[] = [
  { key: 'UploadingToStorage', label: 'Uploading' },
  { key: 'ContentModeration', label: 'Analyzing' },
  { key: 'Encoding240p', label: 'Encoding 240p' },
  { key: 'Encoding360p', label: 'Encoding 360p' },
  { key: 'Encoding480p', label: 'Encoding 480p' },
  { key: 'Encoding720p', label: 'Encoding 720p' },
  { key: 'Encoding1080p', label: 'Encoding 1080p' },
  { key: 'GeneratingHls', label: 'Creating HLS' },
  { key: 'Finalizing', label: 'Finalizing' },
];

const processingStepLabels = Object.fromEntries(
  processingSteps.map((s) => [s.key, s.label]),
) as Record<VideoProcessingStep, string>;

const getProcessingProgress = (step: VideoProcessingStep | null): number => {
  if (!step) {
    return 0;
  }
  const index = processingSteps.findIndex((s) => s.key === step);
  if (index === -1) {
    return 0;
  }
  return Math.round(((index + 1) / processingSteps.length) * 100);
};

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
  const stepLabel = item.processingStep
    ? processingStepLabels[item.processingStep]
    : 'Processing';
  const progress = getProcessingProgress(item.processingStep);
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
                <View className="w-4/5 items-center gap-1.5">
                  <ActivityIndicator size="small" color={colors.blue3} />
                  <Text className="text-[10px] font-black text-blue3">{stepLabel}</Text>
                  <View className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                    <View
                      className="h-full rounded-full bg-blue3"
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                </View>
              )}
              {isBanned && <Text className="text-[12px] font-black text-red3">BANNED</Text>}
            </View>
          )}
        </>
      ) : (
        <View className="size-full items-center justify-center rounded-[8px] bg-black">
          {isProcessing ? (
            <View className="w-4/5 items-center gap-1.5">
              <ActivityIndicator size="small" color={colors.blue3} />
              <Text className="text-[10px] font-black text-blue3">{stepLabel}</Text>
              <View className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                <View
                  className="h-full rounded-full bg-blue3"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          ) : isBanned ? (
            <Text className="text-[12px] font-black text-red3">BANNED</Text>
          ) : (
            <Text className="text-[10px] text-primary">No preview</Text>
          )}
          {canDelete && (
            <CircleIconButton
              size={28}
              className="absolute right-1 top-1 bg-black/60"
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
            </CircleIconButton>
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
};

import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { isIOS } from '../../utils';
import { GestureTouchableOpacity } from './GestureTouchableOpacity';
import { VideoPreview } from './VideoPreview';

export interface VideoBannedProps {
  dimensions: { width: number; height: number };
  previewUrl?: string | null;
  onBackPress?: () => void;
  onDelete?: () => void;
  allowDelete?: boolean;
}

export const VideoBanned = ({
  previewUrl,
  onDelete,
  allowDelete,
  onBackPress,
  dimensions,
}: VideoBannedProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={dimensions}>
      {previewUrl && <VideoPreview blur={isIOS} imageUrl={previewUrl} {...dimensions} />}
      <View className="absolute inset-0 items-center justify-center bg-black/80">
        <View
          style={{ top: insets.top }}
          className="absolute left-2 right-2 top-4 flex-row items-center justify-between"
        >
          <View className="min-w-[20px]">
            <GestureTouchableOpacity
              className="flex-row items-center gap-2"
              onPress={onBackPress}
              hitSlop={10}
            >
              <Ionicons size={24} name="chevron-back" color="#fff" />
            </GestureTouchableOpacity>
          </View>

          {allowDelete && (
            <GestureTouchableOpacity onPress={onDelete} hitSlop={20}>
              <Ionicons name="trash-bin-outline" size={25} color={colors.red} />
            </GestureTouchableOpacity>
          )}
        </View>

        <View className="w-3/4">
          <Text className="text-center text-xl font-bold text-red3">Banned</Text>
          <Text className="text-center text-lg text-white">
            This video has been permanently banned for violating RushRanks policies.
          </Text>
        </View>
      </View>
    </View>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { isIOS } from '../../utils';
import { VideoPreview } from './VideoPreview';

export interface VideoBannedProps {
  dimensions: { width: number; height: number };
  previewUrl?: string | null;
}

export const VideoBanned = ({ previewUrl, dimensions }: VideoBannedProps) => (
  <View style={dimensions}>
    {previewUrl && <VideoPreview blur={isIOS} imageUrl={previewUrl} {...dimensions} />}
    <View className="absolute inset-0 items-center justify-center bg-black/80">
      <View className="w-2/3">
        <Text className="text-center text-xl font-bold text-red3">Banned</Text>
        <Text className="text-center text-lg text-white">
          This video has been permanently banned for violating Reel100 policies.
        </Text>
      </View>
    </View>
  </View>
);

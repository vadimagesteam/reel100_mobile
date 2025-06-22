import React, { FC } from 'react';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet } from 'react-native';

export interface VideoPreviewProps {
  imageUrl: string;
  blur?: boolean;
  width: number;
  height: number;
}

/**
 * This component requires relative parent
 */
export const VideoPreview: FC<VideoPreviewProps> = ({ blur, imageUrl, width, height }) => {
  return (
    <>
      <FastImage
        style={[styles.image, { width, height }]}
        source={{
          uri: imageUrl,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      {blur && (
        <BlurView
          className="absolute left-0 top-0"
          style={[styles.blur, { width, height }]}
          // blurType="light"
          // blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: { position: 'absolute', top: 0, left: 0, flex: 1, borderRadius: 5 },
  blur: { position: 'absolute', top: 0, left: 0 },
});

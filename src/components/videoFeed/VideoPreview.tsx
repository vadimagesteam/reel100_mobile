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
export const VideoPreview = ({ blur, imageUrl, width, height }: VideoPreviewProps) => {
  return (
    <>
      <FastImage
        style={[StyleSheet.absoluteFill, { width, height }]}
        source={{
          uri: imageUrl,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      {blur && (
        <BlurView
          className="absolute bottom-0 left-0 right-0 top-0"
          // blurType="light"
          // blurAmount={1}
          reducedTransparencyFallbackColor="white"
          collapsable={true}
        />
      )}
    </>
  );
};

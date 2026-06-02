import { useMemo } from 'react';
import { PixelRatio, Text, View } from 'react-native';
import { getStateImage } from './stateImages';

export interface StateAvatarProps {
  slug: string;
  size?: number;
}

/**
 * Circular badge for a US state. Renders the per-state silhouette image when
 * one is registered (see stateImages.ts), otherwise falls back to the state
 * abbreviation on a neutral circle. The silhouette assets are produced by the
 * "State profile picture assets" task; this component is the single swap point.
 */
export const StateAvatar = ({ slug, size = 40 }: StateAvatarProps) => {
  const image = getStateImage(slug);
  const fontSize = PixelRatio.roundToNearestPixel(size / 2.8);
  const sizeStyle = useMemo(() => ({ width: size, height: size }), [size]);

  if (image) {
    return (
      <View
        className="items-center justify-center overflow-hidden rounded-full bg-zinc-700"
        style={sizeStyle}
      >
        <image.Component width={size * 0.7} height={size * 0.7} />
      </View>
    );
  }

  return (
    <View
      className="items-center justify-center rounded-full bg-zinc-700"
      style={sizeStyle}
    >
      <Text className="font-semibold text-primary" style={{ fontSize }}>
        {slug?.toUpperCase()}
      </Text>
    </View>
  );
};

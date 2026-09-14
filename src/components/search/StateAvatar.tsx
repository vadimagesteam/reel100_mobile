import { useMemo } from 'react';
import { PixelRatio, Text, View } from 'react-native';
import { colors } from '../../theme';
import { StateSilhouette, resolveStateCode } from './StateSilhouette';

export interface StateAvatarProps {
  slug: string;
  size?: number;
}

/**
 * Circular badge for a US state. Renders the per-state silhouette (see
 * StateSilhouette / statePaths.ts) when the slug resolves to a known state,
 * otherwise falls back to the state abbreviation on a neutral circle.
 */
export const StateAvatar = ({ slug, size = 40 }: StateAvatarProps) => {
  const code = resolveStateCode(slug);
  const fontSize = PixelRatio.roundToNearestPixel(size / 2.8);
  const sizeStyle = useMemo(() => ({ width: size, height: size }), [size]);

  if (code) {
    return (
      <View
        className="items-center justify-center overflow-hidden rounded-full bg-zinc-800"
        style={sizeStyle}
      >
        {/* Svg fills the circle; the margin is baked into the square viewBox. */}
        <StateSilhouette slug={code} size={size} color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      className="items-center justify-center rounded-full bg-zinc-800"
      style={sizeStyle}
    >
      <Text className="font-semibold text-primary" style={{ fontSize }}>
        {slug?.toUpperCase()}
      </Text>
    </View>
  );
};

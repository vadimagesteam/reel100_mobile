import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { STATE_PATHS } from '../../assets/states/statePaths';

// Full state name -> two-letter code, so a full-name slug ("california") still
// resolves to a silhouette even though the backend currently sends "CA".
const NAME_TO_CODE: Record<string, string> = Object.entries(STATE_PATHS).reduce(
  (acc, [code, entry]) => {
    acc[entry.name.toLowerCase()] = code;
    return acc;
  },
  {} as Record<string, string>,
);

/** Normalize a slug to a known state code, or undefined if it isn't a state. */
export const resolveStateCode = (slug?: string): string | undefined => {
  if (!slug) {
    return undefined;
  }
  const upper = slug.trim().toUpperCase();
  if (STATE_PATHS[upper]) {
    return upper;
  }
  return NAME_TO_CODE[slug.trim().toLowerCase()];
};

export interface StateSilhouetteProps {
  slug: string;
  size: number;
  color?: string;
}

/**
 * Renders a single US state silhouette, centered and scaled within a square of
 * `size` (the per-state viewBox is square and centered on the state, so it maps
 * 1:1 into a circular avatar with consistent margin and no letterboxing).
 * Returns null for an unknown slug so callers can fall back.
 */
export const StateSilhouette = memo(({ slug, size, color = '#fff' }: StateSilhouetteProps) => {
  const code = resolveStateCode(slug);
  const entry = code ? STATE_PATHS[code] : undefined;
  if (!entry) {
    return null;
  }

  return (
    <Svg width={size} height={size} viewBox={entry.viewBox} preserveAspectRatio="xMidYMid meet">
      <Path d={entry.d} fill={color} />
    </Svg>
  );
});

StateSilhouette.displayName = 'StateSilhouette';

import type { FC } from 'react';

export type StateImage = {
  Component: FC<{ width: number; height: number }>;
};

/**
 * Registry mapping a state slug (e.g. "CA") to its silhouette image component.
 *
 * Intentionally empty for now: the per-state silhouette assets are produced by
 * the "State profile picture assets" task (slicing a master image into 50
 * optimized images + mapping each to its state). Until those land, StateAvatar
 * falls back to the state abbreviation. To enable images, register components
 * here keyed by uppercased slug, e.g.:
 *
 *   import CA from '../../assets/states/CA';
 *   const STATE_IMAGES = { CA: { Component: CA }, ... };
 */
const STATE_IMAGES: Record<string, StateImage> = {};

export const getStateImage = (slug?: string): StateImage | undefined => {
  if (!slug) return undefined;
  return STATE_IMAGES[slug.toUpperCase()];
};

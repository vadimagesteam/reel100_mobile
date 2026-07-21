import { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';
import clsx from 'clsx';

export interface CircleIconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Circle diameter (also the tap target). Defaults to 40. */
  size?: number;
  /** Optional circular background. Transparent when omitted. */
  background?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A circular icon button with a fixed hit area that optically centers whatever
 * icon it wraps — regardless of the glyph's own viewBox or intrinsic metrics —
 * via flexbox centering rather than padding.
 *
 * Replaces the scattered one-off round buttons whose glyphs sat up-and-left of
 * their circle, and the per-platform / iOS-26 offset hacks that were papering
 * over the miscentering.
 */
export const CircleIconButton = ({
  size = 40,
  background,
  className,
  hitSlop = 8,
  children,
  ...props
}: CircleIconButtonProps) => (
  <Pressable
    hitSlop={hitSlop}
    className={clsx('items-center justify-center rounded-full', className)}
    style={[{ width: size, height: size }, background ? { backgroundColor: background } : null]}
    {...props}
  >
    {children}
  </Pressable>
);

import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useAnimatedStyle } from 'react-native-reanimated';

/**
 * Bottom padding for an input bar pinned to the bottom edge: `base` plus the
 * navigation bar inset (see useNavigationBarInset), with the inset collapsing
 * as the keyboard opens. The keyboard already covers the navigation bar, so
 * keeping the inset while typing would leave a gap between input and keyboard.
 */
export const useNavigationBarInsetPadding = (base: number, inset: number) => {
  const { progress } = useReanimatedKeyboardAnimation();
  return useAnimatedStyle(
    () => ({ paddingBottom: base + inset * (1 - progress.value) }),
    [base, inset],
  );
};

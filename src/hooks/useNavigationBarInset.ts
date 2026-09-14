import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '../utils/platform';

/**
 * Height of the Android system navigation bar the app draws behind.
 *
 * The app runs edge-to-edge (KeyboardProvider `navigationBarTranslucent`, and
 * Android 15+ enforces it), so on phones with 3-button navigation the system
 * back/home/recents buttons sit on top of whatever the app renders at the
 * bottom edge and swallow its taps. Pad bottom-anchored controls by this.
 *
 * 0 on iOS: the home indicator only reacts to swipes, and the iOS layouts are
 * already tuned around it.
 */
export const useNavigationBarInset = () => {
  const { bottom } = useSafeAreaInsets();
  return isAndroid ? bottom : 0;
};

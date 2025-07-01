import { CommonActions } from '@react-navigation/native';
import { navigationRef } from './navigationRef';
import { Screens } from './screens.ts';

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Screens.Login }],
      }),
    );
  }
}

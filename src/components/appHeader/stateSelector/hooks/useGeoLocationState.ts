import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useStatesQuery } from './useStatesQuery';
import { useDetectState } from './useDetectState';
import { useDetectedStateSelector, useStateSelector } from '../../../../state/app/uiStore';

// Re-detect the user's physical state on app foreground at most this often, so
// a user who has travelled uploads to the state they're actually in — without
// hammering the geocoder or interrupting them. (Client doc §7: "consider
// refreshing the user's location more frequently.")
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const useGeoLocationState = () => {
  const { data: states } = useStatesQuery();
  const [selectedState] = useStateSelector();
  const [detectedState] = useDetectedStateSelector();
  const detectState = useDetectState();
  const lastDetectAtRef = useRef(0);

  const detectAndStamp = useCallback(
    (silent: boolean) => {
      lastDetectAtRef.current = Date.now();
      return detectState(silent);
    },
    [detectState],
  );

  // First-run detection. Prompt and resolve when the user has no browse filter
  // yet; if only the filter survived a restart but we have no detected upload
  // state, resolve it silently so a new upload still targets the real location.
  useEffect(() => {
    if (!states) {
      return;
    }
    if (!selectedState) {
      detectAndStamp(false);
    } else if (!detectedState) {
      detectAndStamp(true);
    }
  }, [states, selectedState, detectedState, detectAndStamp]);

  // Keep the state fresh: silently re-detect when the app returns to the
  // foreground, throttled so we don't re-geocode on every quick app switch.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        nextState === 'active' &&
        states &&
        Date.now() - lastDetectAtRef.current > REFRESH_INTERVAL_MS
      ) {
        detectAndStamp(true);
      }
    });

    return () => subscription.remove();
  }, [states, detectAndStamp]);
};

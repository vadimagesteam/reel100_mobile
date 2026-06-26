import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useStatesQuery } from './useStatesQuery';
import { StateItem, useDetectedStateSelector, useStateSelector } from '../../../../state/app/uiStore';
import { requestLocationPermission } from '../requestLocationPermission';

const getStateFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ReelApp/1.0',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.address?.state || null;
  } catch (error) {
    console.error('Error fetching state from Nominatim:', error);
    return null;
  }
};

// On-demand geolocation -> US state resolution, with no side effects of its own.
// `useGeoLocationState` wraps this with the app-level first-run/foreground
// refresh effects; screens that just need to resolve the location once (e.g. the
// upload screen's refresh button) can call `detectState` directly without
// re-mounting those effects.
export const useDetectState = () => {
  const { data: states } = useStatesQuery();
  const [selectedState, setSelectedState] = useStateSelector();
  const [, setDetectedState] = useDetectedStateSelector();

  // Read the browse filter inside the async geolocation callback without making
  // it a dependency of `detectState`.
  const selectedStateRef = useRef(selectedState);
  selectedStateRef.current = selectedState;

  const detectState = useCallback(
    // `silent` suppresses the permission/failure alerts for background refreshes
    // (we only prompt during explicit, user-initiated detection). Resolves with
    // the detected state, or null if it couldn't be determined.
    async (silent: boolean): Promise<StateItem | null> => {
      if (!states) {
        return null;
      }

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        if (!silent) {
          console.warn('Location permission denied');
        }
        return null;
      }

      return new Promise<StateItem | null>((resolve) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const state = await getStateFromCoords(latitude, longitude);

            if (state) {
              const storedState = states.find((item) => item.label === state);
              if (storedState) {
                console.log('📍Geolocation state from API', state);
                // Always record the physical location — this is what a new
                // upload is posted to (see VideoPreview), independent of what the
                // user is browsing.
                setDetectedState(storedState);
                // Only seed the browse filter on the true first run (no filter
                // yet) so the user lands on their own state. After that the
                // filter is theirs to change.
                if (!selectedStateRef.current) {
                  setSelectedState(storedState);
                }
                resolve(storedState);
                return;
              }
            }

            if (!silent) {
              Alert.alert(
                'Hmm…',
                'We couldn’t determine your state. If you’re outside the US, please select a state manually to continue.',
              );
            }
            resolve(null);
          },
          async (error) => {
            console.error(error);
            if (!silent) {
              Alert.alert('Warning', `Unable get your geoposition: ${error.message}`);
            }
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      });
    },
    [states, setSelectedState, setDetectedState],
  );

  return detectState;
};

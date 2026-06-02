import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useStatesQuery } from './useStatesQuery';
import { useStateSelector } from '../../../../state/app/uiStore';
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

// Re-detect the user's physical state on app foreground at most this often, so
// a user who has travelled uploads to the state they're actually in — without
// hammering the geocoder or interrupting them. (Client doc §7: "consider
// refreshing the user's location more frequently.")
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const useGeoLocationState = () => {
  const { data: states } = useStatesQuery();
  const [selectedState, setSelectedState] = useStateSelector();
  const lastDetectAtRef = useRef(0);

  const detectState = useCallback(
    // `silent` suppresses the permission/failure alerts for background refreshes
    // (we only prompt during the explicit first-run detection).
    async (silent: boolean) => {
      if (!states) {
        return;
      }

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        if (!silent) {
          console.warn('Location permission denied');
        }
        return;
      }

      lastDetectAtRef.current = Date.now();

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const state = await getStateFromCoords(latitude, longitude);

          if (state) {
            const storedState = states.find((item) => item.label === state);
            if (storedState) {
              console.log('📍Geolocation state from API', state);
              setSelectedState(storedState);
              return;
            }
          }

          if (!silent) {
            Alert.alert(
              'Hmm…',
              'We couldn’t determine your state. If you’re outside the US, please select a state manually to continue.',
            );
          }
        },
        async (error) => {
          console.error(error);
          if (!silent) {
            Alert.alert('Warning', `Unable get your geoposition: ${error.message}`);
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    },
    [states, setSelectedState],
  );

  // First-run detection: prompt and resolve the state when we don't have one.
  useEffect(() => {
    if (states && !selectedState) {
      detectState(false);
    }
  }, [states, selectedState, detectState]);

  // Keep the state fresh: silently re-detect when the app returns to the
  // foreground, throttled so we don't re-geocode on every quick app switch.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        nextState === 'active' &&
        states &&
        Date.now() - lastDetectAtRef.current > REFRESH_INTERVAL_MS
      ) {
        detectState(true);
      }
    });

    return () => subscription.remove();
  }, [states, detectState]);
};

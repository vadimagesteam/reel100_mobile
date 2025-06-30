import { useEffect } from 'react';
import { requestLocationPermission } from '../../../../screens/Dashboard/Main/MainScreen/helpers';
import Geolocation from 'react-native-geolocation-service';
import { useStatesQuery } from './useStatesQuery.ts';
import { useStateSelector } from '../../../../state/app/uiStore.ts';
import { Alert } from 'react-native';

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

export const useGeoLocationState = () => {
  const { data: states } = useStatesQuery();
  const [selectedState, setSelectedState] = useStateSelector();

  useEffect(() => {
    const getUserLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('LAT LONG', { latitude, longitude });

          const state = await getStateFromCoords(latitude, longitude);
          if (state) {
            console.log('📍Geolocation state from API', state);
            const storedState = states!.find((item) => item.label === state);
            if (storedState) {
              setSelectedState(storedState);
            } else {
              Alert.alert(
                'Hmm…',
                'We couldn’t determine your state. If you’re outside the US, please select a state manually to continue.',
              );
            }
          } else {
            Alert.alert(
              'Hmm…',
              'We couldn’t determine your state. If you’re outside the US, please select a state manually to continue.',
            );
          }
        },
        async (error) => {
          console.error(error);
          Alert.alert('Warning', `Unable get your geoposition: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    if (states && !selectedState) {
      getUserLocation();
    }
  }, [states, selectedState, setSelectedState]);
};

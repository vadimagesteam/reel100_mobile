import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Function to request geolocation permission
export const requestLocationPermission = async () => {
    const permission =
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
        return true;
    }

    const result = await request(permission);
    return result === RESULTS.GRANTED;
};

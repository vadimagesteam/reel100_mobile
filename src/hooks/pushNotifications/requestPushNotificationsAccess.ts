import { AuthorizationStatus } from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid } from 'react-native';
import { isIOS } from '../../utils';
import { messaging } from './firebase';

const requestIOSPermissions = async () => {
  const status = await messaging.requestPermission();
  const enabled =
    status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;

  console.log('iOS push notifications status', status);
  return enabled;
};

const requestAndroidPermissions = async () => {
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  console.log('[requestUserPermission] Android push notifications status:', status);
  return status === 'granted';
};

export const requestPushNotificationsAccess = async () => {
  try {
    return isIOS ? requestIOSPermissions() : requestAndroidPermissions();
  } catch (error) {
    Alert.alert('Request Push permissions failed.', (error as Error).message ?? 'Unknown reason');
  }
};

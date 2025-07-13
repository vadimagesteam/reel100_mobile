import { PermissionsAndroid } from 'react-native';
import { isIOS } from '../../utils';

export const requestCameraRollSavePermissions = async () => {
  if (isIOS) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  return status === PermissionsAndroid.RESULTS.GRANTED;
};

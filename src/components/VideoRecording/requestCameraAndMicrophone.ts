import { openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Alert, Platform } from 'react-native';

export interface PermissionsResult {
  camera: boolean;
  microphone: boolean;
  allGranted: boolean;
}

export const requestCameraAndMicrophone = async (): Promise<PermissionsResult> => {
  try {
    const cameraPermission = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      })!,
    );

    const micPermission = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      })!,
    );

    if (cameraPermission === RESULTS.BLOCKED || micPermission === RESULTS.BLOCKED) {
      Alert.alert(
        'Permissions Blocked',
        'Please allow access to the camera and microphone from Settings',
        [
          {
            text: 'Open Settings',
            onPress: async () => {
              await openSettings();
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    }

    const camera = cameraPermission === RESULTS.GRANTED;
    const microphone = micPermission === RESULTS.GRANTED;

    return {
      camera,
      microphone,
      allGranted: camera && microphone,
    };
  } catch (error) {
    console.error('Permission error:', error);
    return {
      allGranted: false,
      camera: false,
      microphone: false,
    };
  }
};

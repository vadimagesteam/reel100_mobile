import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const isIOS26Plus = isIOS && Number(Platform.Version) >= 26;

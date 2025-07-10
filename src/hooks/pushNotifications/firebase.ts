import { getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';

const app = getApp();
export const messaging = getMessaging(app);

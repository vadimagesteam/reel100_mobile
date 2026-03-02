import mobileAds from 'react-native-google-mobile-ads';
import { useEffect } from 'react';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import { isIOS } from '../../../../utils';

const initializeAdmob = async () => {
  if (isIOS) {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
  }

  return mobileAds().initialize();
};

export const useAdmobInitialization = (enabled: boolean) => {
  useEffect(() => {
    if (enabled) {
      initializeAdmob()
        .then((adapterStatuses) => {
          console.log('[Admob initialization completed]', adapterStatuses);
        })
        .catch(console.error);
    }
  }, [enabled]);
};

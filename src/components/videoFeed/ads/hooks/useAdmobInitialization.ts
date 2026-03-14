import mobileAds from 'react-native-google-mobile-ads';
import { useEffect } from 'react';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import { isIOS } from '../../../../utils';
import { adDebugLog } from '../adDebugLog';

const initializeAdmob = async () => {
  if (isIOS) {
    adDebugLog.info('Checking ATT permission...');
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    adDebugLog.info(`ATT status: ${result}`);
    if (result === RESULTS.DENIED) {
      adDebugLog.info('Requesting ATT permission...');
      const requestResult = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      adDebugLog.info(`ATT request result: ${requestResult}`);
    }
  }

  adDebugLog.info('Calling mobileAds().initialize()...');
  return mobileAds().initialize();
};

export const useAdmobInitialization = (enabled: boolean) => {
  useEffect(() => {
    if (enabled) {
      adDebugLog.info(`AdMob init starting (enabled=${enabled}, __DEV__=${__DEV__})`);
      initializeAdmob()
        .then((adapterStatuses) => {
          const statusStr = JSON.stringify(adapterStatuses, null, 2);
          adDebugLog.info(`AdMob initialized. Adapters: ${statusStr}`);
          console.log('[Admob initialization completed]', adapterStatuses);
        })
        .catch((err) => {
          adDebugLog.error(`AdMob init FAILED: ${err?.message ?? err}`);
          console.error(err);
        });
    } else {
      adDebugLog.warn('AdMob init skipped (enabled=false, user not authenticated?)');
    }
  }, [enabled]);
};

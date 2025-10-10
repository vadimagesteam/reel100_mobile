import mobileAds from 'react-native-google-mobile-ads';
import { useEffect } from 'react';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import { useAdState } from './useAdState';

const initializeAdmob = async () => {
  const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
  if (result === RESULTS.DENIED) {
    // The permission has not been requested, so request it.
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
  }

  // await mobileAds().setRequestConfiguration({});
  return mobileAds().initialize();
};

export const useAdmobInitialization = (enabled: boolean) => {
  const subscribe = useAdState((s) => s.subscribeToAdEvents);
  const unsubscribe = useAdState((s) => s.unsubscribeFromAdEvents);

  useEffect(() => {
    if (enabled) {
      initializeAdmob().then((adapterStatuses) => {
        console.log('[Admob initialization completed]', adapterStatuses);
        subscribe();
      });
    }
    return () => {
      unsubscribe();
    };
  }, [enabled, subscribe, unsubscribe]);
};

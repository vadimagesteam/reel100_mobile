import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigation } from './src/navigation/RootNavigation.tsx';
import './global.css';
import { useAuthStore } from './src/state/user/authStore.ts';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { enableScreens } from 'react-native-screens';
import { asyncStoragePersister, queryClient } from './src/lib/api.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging, {
  AuthorizationStatus,
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import './src/nativewindInterops';

enableScreens(true);

async function requestUserPermission() {
  try {
    console.log('[requestUserPermission] CHECK PUSH PERMISSIONS');
    const messaging = getMessaging(getApp());
    const authStatus = await requestPermission(messaging);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    console.log('[requestUserPermission] Authorization status:', authStatus);

    return enabled;
  } catch (error) {
    console.log('REQUEST PUSH ERROR', error);
  }
}

function App(): React.JSX.Element {
  const isAuthenticated = useAuthStore(({ isAuthenticated }) => isAuthenticated);
  const [storeHydrated, setStoreHydrated] = useState<boolean>(false);

  useEffect(() => {
    showSplash();
    return useAuthStore.persist.onFinishHydration(() => {
      setStoreHydrated(true);
      hideSplash();
    });
  }, []);

  // todo: must be moved into a separated module/lib
  useEffect(() => {
    if (isAuthenticated) {
      requestUserPermission();

      (async () => {
        const fcmToken = await messaging().getToken();
        console.log('[FCM TOKEN]', fcmToken);

        messaging().onTokenRefresh((newToken) => {
          console.log('[FCM TOKEN UPDATED]', newToken);
        });
      })();
    }
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView className="flex-1 bg-black4">
      {storeHydrated && (
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <SafeAreaProvider>
            <RootNavigation isAuthenticated={isAuthenticated} />
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      )}
    </GestureHandlerRootView>
  );
}

export default App;

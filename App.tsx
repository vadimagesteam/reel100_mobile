import { PortalProvider } from '@gorhom/portal';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePushNotifications } from './src/hooks/pushNotifications/usePushNotifications';
import { RootNavigation } from './src/navigation/RootNavigation.tsx';
import './global.css';
import { useAuthStore } from './src/state/user/authStore.ts';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { enableScreens } from 'react-native-screens';
import { asyncStoragePersister, queryClient } from './src/lib/api.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/lib/nativewindInterops';

enableScreens(true);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

function App(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [storeHydrated, setStoreHydrated] = useState<boolean>(false);

  useEffect(() => {
    showSplash();
    return useAuthStore.persist.onFinishHydration(() => {
      setStoreHydrated(true);
      hideSplash();
    });
  }, []);

  usePushNotifications(isAuthenticated);

  return (
    <GestureHandlerRootView className="flex-1 bg-black4">
      {storeHydrated && (
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <SafeAreaProvider>
            <PortalProvider>
              <RootNavigation isAuthenticated={isAuthenticated} />
            </PortalProvider>
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      )}
    </GestureHandlerRootView>
  );
}

export default App;

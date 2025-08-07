import { PortalProvider } from '@gorhom/portal';
import React, { useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePushNotifications } from './src/hooks/pushNotifications/usePushNotifications';
import { getAllStoreHydratedPromises } from './src/lib/createPersistStore';
import { RootNavigation } from './src/navigation/RootNavigation';
import './global.css';
import { useAuthStore } from './src/state/user/authStore';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { enableScreens } from 'react-native-screens';
import { asyncStoragePersister, queryClient } from './src/lib/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/lib/nativewindInterops';

// import here as a temp solution to start persistign this store right away
import './src/state/app/uiStore';

enableScreens(true);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [storeHydrated, setStoreHydrated] = useState<boolean>(false);

  usePushNotifications(isAuthenticated);

  useEffect(() => {
    showSplash();

    const checkHydration = async () => {
      await getAllStoreHydratedPromises();
      setStoreHydrated(true);
      hideSplash();
    };

    checkHydration();
  }, []);

  if (!storeHydrated) {
    return <View className="h-full w-full flex-1 bg-background" />;
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
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

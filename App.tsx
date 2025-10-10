import { Toasts } from '@backpackapp-io/react-native-toast';
import { PortalProvider } from '@gorhom/portal';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/lib/nativewindInterops';
import { enableScreens } from 'react-native-screens';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { useAdmobInitialization } from './src/components/videoFeed/ads/hooks/useAdmobInitialization';
import { usePushNotifications } from './src/hooks/pushNotifications/usePushNotifications';
import { asyncStoragePersister, queryClient } from './src/lib/api';
import { getAllStoreHydratedPromises } from './src/lib/createPersistStore';
import { RootNavigation } from './src/navigation/RootNavigation';
import './global.css';
import { useAuthStore } from './src/state/user/authStore';

// import here as a temp solution to start persistign this store right away
import './src/state/app/uiStore';

enableScreens(true);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [storeHydrated, setStoreHydrated] = useState<boolean>(false);

  useAdmobInitialization(isAuthenticated);
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
    <KeyboardProvider>
      <GestureHandlerRootView className="flex-1 bg-background">
        {storeHydrated && (
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
          >
            <SafeAreaProvider>
              <PortalProvider>
                <RootNavigation isAuthenticated={isAuthenticated} />
                <Toasts overrideDarkMode={false} />
              </PortalProvider>
            </SafeAreaProvider>
          </PersistQueryClientProvider>
        )}
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}

export default App;

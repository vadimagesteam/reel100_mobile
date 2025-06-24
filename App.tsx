import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigation } from './src/navigation/RootNavigation.tsx';
import './global.css';
import { Provider } from 'react-redux';
import store from './src/store/store.ts';
import { useAuthStore } from './src/state/user/authStore.ts';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { enableScreens } from 'react-native-screens';
import { asyncStoragePersister, queryClient } from './src/lib/api.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';

enableScreens(true);

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

  return (
    <GestureHandlerRootView className="flex-1 bg-black4">
      <Provider store={store}>
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
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;

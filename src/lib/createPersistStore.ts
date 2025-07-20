import type { StateCreator, StoreApi } from 'zustand/vanilla';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import omit from 'lodash.omit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from './api';

export interface PersistStorageParams<T> {
  name: string;
  version: number;
  ignore: (keyof T)[];
}

type Store<T = object> = StoreApi<T> & {
  persist: {
    clearStorage: () => void;
  };
};

const persistedStores: Store[] = [];

export const createPersistStore = <T extends object>(
  fn: StateCreator<T>,
  { name, ignore = [], version = 0 }: PersistStorageParams<T>,
) => {
  const store = create<T>()(
    persist(fn, {
      name,
      version,
      // do not serialize actions
      partialize: (state) => omit(state, ['actions', ...ignore]),
      storage: createJSONStorage(() => AsyncStorage),
    }),
  );
  store.persist;
  persistedStores.push(store as Store<T>);
  return store;
};

export const clearStoreCaches = async () => {
  for (const store of persistedStores) {
    store.persist.clearStorage();
  }
  queryClient.clear();
};

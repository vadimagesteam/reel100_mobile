import type { StateCreator } from 'zustand/vanilla';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import omit from 'lodash.omit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PersistStorageParams<T> {
  name: string,
  version: number,
  ignore: (keyof T)[],
}

export const createPersistStore = <T extends object>(
  fn: StateCreator<T>,
  { name, ignore = [], version = 0 }: PersistStorageParams<T>,
) => create<T>()(devtools(persist(fn, {
  name,
  version,
  // do not serialize actions
  partialize: (state) => omit(state, ['actions', ...ignore]),
  storage: createJSONStorage(() => AsyncStorage),
})));

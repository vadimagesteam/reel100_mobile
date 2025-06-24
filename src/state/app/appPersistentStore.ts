import { createPersistStore } from '../../lib/createPersistStore.ts';

export type StateItem = {
  id: string;
  slug: string;
  label: string;
};

type AuthState = {
  selectedState: StateItem | null;
  actions: {
    setState: (state: StateItem | null) => void;
  };
};

/**
 * The store is designed to store any app settings like selected state that have to be persistant
 */

export const useAppPersistentStore = createPersistStore<AuthState>(
  (set) => ({
    selectedState: null,
    actions: {
      setState: (state) => {
        set({ selectedState: state });
      },
    },
  }),
  {
    version: 0,
    ignore: [],
    name: 'au',
  },
);

export const useStateSelector = (): [
  AuthState['selectedState'],
  AuthState['actions']['setState'],
] => {
  return [
    useAppPersistentStore((s) => s.selectedState),
    useAppPersistentStore((s) => s.actions.setState),
  ];
};

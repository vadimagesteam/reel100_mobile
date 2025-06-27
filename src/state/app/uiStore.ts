import { createPersistStore } from '../../lib/createPersistStore.ts';

export type StateItem = {
  id: string;
  slug: string;
  label: string;
};

type UIStore = {
  menuOpened: boolean;
  selectedState: StateItem | null;
  actions: {
    setMenuOpened: (isPaused: boolean) => void;
    setState: (state: StateItem | null) => void;
  };
};

export const useUiStore = createPersistStore<UIStore>(
  (set) => ({
    menuOpened: false,
    selectedState: null,
    actions: {
      setMenuOpened: (isOpened: boolean) => set({ menuOpened: isOpened }),
      setState: (state) => {
        set({ selectedState: state });
      },
    },
  }),
  {
    version: 1,
    ignore: ['menuOpened'],
    name: 'ui_store',
  },
);

export const useUiStoreActions = () => useUiStore((s) => s.actions);

export const useStateSelector = (): [UIStore['selectedState'], UIStore['actions']['setState']] => {
  return [useUiStore((s) => s.selectedState), useUiStore((s) => s.actions.setState)];
};

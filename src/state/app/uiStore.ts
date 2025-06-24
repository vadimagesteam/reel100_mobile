import { create } from 'zustand';

type PlayerStore = {
  menuOpened: boolean;
  actions: {
    setMenuOpened: (isPaused: boolean) => void;
  };
};

export const useUiStore = create<PlayerStore>((set, get) => ({
  menuOpened: false,
  actions: {
    setMenuOpened: (isOpened: boolean) => set({ menuOpened: isOpened }),
  },
}));

export const useUiStoreActions = () => useUiStore((s) => s.actions);

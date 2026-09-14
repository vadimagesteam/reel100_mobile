import { createPersistStore } from '../../lib/createPersistStore';

export type StateItem = {
  id: string;
  slug: string;
  label: string;
};

type UIStore = {
  menuOpened: boolean;
  // The state whose rankings/feed the user is currently *browsing*. The user can
  // freely point this at any state (header picker, search, empty-feed CTA), so it
  // must NOT be used as the target for a new upload — see `detectedState`.
  selectedState: StateItem | null;
  // The state the user is physically in, resolved from geolocation. This is the
  // default target a new video is posted to, kept separate from `selectedState`
  // so browsing another state's rankings can't cause an upload to land there.
  detectedState: StateItem | null;
  actions: {
    setMenuOpened: (isPaused: boolean) => void;
    setState: (state: StateItem | null) => void;
    setDetectedState: (state: StateItem | null) => void;
  };
};

export const useUiStore = createPersistStore<UIStore>(
  (set) => ({
    menuOpened: false,
    selectedState: null,
    detectedState: null,
    actions: {
      setMenuOpened: (isOpened: boolean) => set({ menuOpened: isOpened }),
      setState: (state) => {
        set({ selectedState: state });
      },
      setDetectedState: (state) => {
        set({ detectedState: state });
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

export const useDetectedStateSelector = (): [
  UIStore['detectedState'],
  UIStore['actions']['setDetectedState'],
] => {
  return [useUiStore((s) => s.detectedState), useUiStore((s) => s.actions.setDetectedState)];
};

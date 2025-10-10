import { Platform, StatusBar } from 'react-native';
import { TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { create } from 'zustand/index';
import { randInt } from '../../../../utils';

type AdStore = {
  adShowConfig: {
    minVideoWatched: [number, number];
    minSecondsWatched: number;
  };
  isAdLoaded: boolean;
  videosWatched: number;
  timeWatched: number;
  fullscreenWatched: number;
  isAdInitialized: boolean;
  isAdPlaying: boolean;

  subscribeToAdEvents: () => void;
  unsubscribeFromAdEvents: () => void;
  showAd: () => void;
  increaseVideosWatched: () => void;
  increaseTimeWatched: () => void;
  trackFullscreenWatched: () => void;
  resetFullscreenWatched: () => void;
  canPlayAd: () => boolean;
  shouldPlayAd: () => boolean;
};

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-1067183093868518/5054746748';

// Global interstitial ad instance
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: [], // can be customized based on video description, tags, etc
});

export const useAdState = create<AdStore>((set, get) => {
  const listeners: Array<() => void> = [];

  return {
    adShowConfig: {
      minVideoWatched: [4, 5],
      minSecondsWatched: 250,
    },
    isAdInitialized: false,
    isAdLoaded: false,
    isAdPlaying: false,
    videosWatched: 0,
    timeWatched: 0,
    fullscreenWatched: 0,

    //#region fns
    subscribeToAdEvents: () => {
      // start preload ad
      interstitial.load();

      listeners.push(
        interstitial.addAdEventListener(AdEventType.LOADED, () => {
          set({ isAdLoaded: true });
        }),
      );

      listeners.push(
        interstitial.addAdEventListener(AdEventType.OPENED, () => {
          if (Platform.OS === 'ios') {
            // Prevent the close button from being unreachable by hiding the status bar on iOS
            StatusBar.setHidden(true);
          }
          set({ isAdLoaded: false, isAdPlaying: true, videosWatched: 0, timeWatched: 0 });
        }),
      );

      listeners.push(
        interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          if (Platform.OS === 'ios') {
            StatusBar.setHidden(false);
          }
          set({ isAdLoaded: false, isAdPlaying: false });

          // Once add was closed, we can load another ad
          interstitial.load();
        }),
      );

      listeners.push(
        interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
          console.log('Ad error:', error);
          // simple retry for now
          setTimeout(() => interstitial.load(), 2000);
        }),
      );
    },

    unsubscribeFromAdEvents: () => {
      listeners.forEach((unsubscribe) => unsubscribe());
      listeners.length = 0;
    },

    increaseTimeWatched: () =>
      set((prev) => ({
        timeWatched: prev.timeWatched + 1,
      })),

    increaseVideosWatched: () =>
      set((prev) => ({
        videosWatched: prev.videosWatched + 1,
      })),

    trackFullscreenWatched: () =>
      set((prev) => ({
        fullscreenWatched: prev.fullscreenWatched + 1,
      })),

    resetFullscreenWatched: () => set({ fullscreenWatched: 0 }),

    showAd: () => {
      if (get().isAdLoaded) {
        interstitial.show();
      }
    },

    // Business logic
    canPlayAd: () => {
      const { videosWatched, timeWatched, adShowConfig } = get();
      const { minVideoWatched, minSecondsWatched } = adShowConfig;
      const rndMinVideoWatched = randInt(minVideoWatched[0], minVideoWatched[1]);

      return videosWatched >= rndMinVideoWatched || timeWatched >= minSecondsWatched;
    },
    shouldPlayAd: () => {
      const { fullscreenWatched, canPlayAd } = get();
      return fullscreenWatched > 1 && canPlayAd();
    },
    //#endregion
  };
});

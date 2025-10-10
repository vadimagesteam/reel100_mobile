import { useEffect } from 'react';
import { useAdState } from './useAdState';

type AdPlaybackProps = {
  enabled: boolean;
  isFullscreen: boolean;
};

/**
 * This hook tracks video swipe in Fullscreen
 * If it wasn't the first Fullscreen extrance - it plays Ad
 */
export const useAdPlayback = ({ enabled, isFullscreen }: AdPlaybackProps) => {
  const showAd = useAdState((s) => s.showAd);
  const trackFullscreenWatched = useAdState((s) => s.trackFullscreenWatched);
  const shouldPlayAd = useAdState((s) => s.shouldPlayAd);

  useEffect(() => {
    if (enabled && isFullscreen) {
      trackFullscreenWatched();
      if (shouldPlayAd()) {
        showAd();
      }
    }
  }, [shouldPlayAd, enabled, isFullscreen, trackFullscreenWatched, showAd]);
};

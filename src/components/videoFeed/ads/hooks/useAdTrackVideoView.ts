import { useRef, useEffect } from 'react';
import type { OnProgressData } from 'react-native-video';
import { useAdState } from './useAdState';

/**
 * Track watched time and watched video count
 */
export const useAdTrackVideoView = (data: OnProgressData | undefined | null) => {
  const increaseVideosWatched = useAdState((s) => s.increaseVideosWatched);
  const increaseTimeWatched = useAdState((s) => s.increaseTimeWatched);
  const isWatched = useRef(false);

  useEffect(() => {
    if (data) {
      // Track stats for ad show
      const currentTime = +data.currentTime.toFixed(1);
      const markAsViewThreshold = Math.min(Math.floor(data.seekableDuration), 10);

      if (currentTime && currentTime % 1 === 0) {
        increaseTimeWatched();

        if (currentTime >= markAsViewThreshold && !isWatched.current) {
          increaseVideosWatched();
          isWatched.current = true;
        }
      }
    }
  }, [data, increaseTimeWatched, increaseVideosWatched]);
};

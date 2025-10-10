import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useCallback } from 'react';
import { useVideoFullscreen } from '../../hooks';
import { useAdState } from './useAdState';

/**
 * Reset number of videos watched in fullScreen
 * We need this to do not show ad when the first fullscreen video opened even if ad conditions are met
 */
export const useAdTrackFullScreenExit = () => {
  const { isFullscreen } = useVideoFullscreen();
  const resetFullscreenWatched = useAdState((s) => s.resetFullscreenWatched);

  // Fullscreen exit: reset videos watched in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      resetFullscreenWatched();
    }
  }, [isFullscreen, resetFullscreenWatched]);

  // Focus out: reset videos watched in fullscreen
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetFullscreenWatched();
      };
    }, [resetFullscreenWatched]),
  );

  // Unmount
  useEffect(() => {
    return () => {
      resetFullscreenWatched();
    };
  }, [resetFullscreenWatched]);
};

import { useVideoFeed } from './useVideoFeed.ts';

export const useVideoFullscreen = () => {
  const isFullscreen = useVideoFeed((s) => s.isPlayerFullScreen);
  const setFullscreen = useVideoFeed((s) => s.actions.setIsPlayerFullScreen);
  return { isFullscreen, setFullscreen };
};

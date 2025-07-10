import { useVideoFeed } from './useVideoFeed';

export const useVideoFullscreen = () => {
  const isFullscreen = useVideoFeed((s) => s.isPlayerFullScreen);
  const setFullscreen = useVideoFeed((s) => s.actions.setIsPlayerFullScreen);
  return { isFullscreen, setFullscreen };
};

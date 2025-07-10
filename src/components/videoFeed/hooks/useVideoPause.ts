import { useVideoFeed } from './useVideoFeed';

export const useVideoPause = () => {
  const isPaused = useVideoFeed((s) => s.isPaused);
  const setIsPaused = useVideoFeed((s) => s.actions.setIsPaused);
  const togglePause = useVideoFeed((s) => s.actions.togglePause);
  return { isPaused, setIsPaused, togglePause };
};

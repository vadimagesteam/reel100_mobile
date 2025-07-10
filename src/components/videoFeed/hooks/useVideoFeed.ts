import { VideoFeedStore } from '../provider/videoFeedStore';
import { useContext } from 'react';
import { VideoFeedContext } from '../provider/context';
import { useStore } from 'zustand/react';

export const useVideoFeed = <T>(selector: (state: VideoFeedStore) => T): T => {
  const store = useContext(VideoFeedContext);
  if (!store) {
    throw new Error('useVideoFeed must be used within VideoFeedProvider');
  }
  return useStore(store, selector);
};

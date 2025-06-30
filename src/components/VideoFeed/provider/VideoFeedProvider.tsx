import React, { ReactNode, useState } from 'react';
import { VideoFeedContext } from './context';
import { createVideoFeedStore, VideoFeedStore } from './videoFeedStore.ts';

export interface VideoFeedProviderProps {
  children: ReactNode;
  initialState?: Partial<Omit<VideoFeedStore, 'actions'>>;
}

export const VideoFeedProvider = ({ initialState, children }: VideoFeedProviderProps) => {
  const [store] = useState(() => createVideoFeedStore(initialState));
  return <VideoFeedContext.Provider value={store}>{children}</VideoFeedContext.Provider>;
};

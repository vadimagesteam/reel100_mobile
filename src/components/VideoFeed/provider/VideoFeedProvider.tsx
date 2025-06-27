import React, { ReactNode, useState } from 'react';
import { VideoFeedContext } from './context';
import { createVideoFeedStore } from './videoFeedStore.ts';

export interface VideoFeedProviderProps {
  children: ReactNode;
}

export const VideoFeedProvider = ({ children }: VideoFeedProviderProps) => {
  const [store] = useState(() => createVideoFeedStore());
  return <VideoFeedContext.Provider value={store}>{children}</VideoFeedContext.Provider>;
};

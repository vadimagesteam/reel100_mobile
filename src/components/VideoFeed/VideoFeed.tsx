import React, { createContext, useContext } from 'react';
import { VideoList, SwipeableVideosListProps } from './VideoList.tsx';

export const VideoFeedContext = createContext<{ cacheKey: string } | undefined>(undefined);

export const useVideoFeed = () => {
  const ctx = useContext(VideoFeedContext);
  if (!ctx)
    throw new Error(
      'useVideoFeed must be used within VideoFeedProvider. Make sure the "SwipeableVideosList" is wrapped with VideoFeedContext context',
    );
  return ctx;
};

export interface VideoFeedProps extends SwipeableVideosListProps {
  cacheKey: string;
}

export const VideoFeed = ({ cacheKey, ...videoListProps }: VideoFeedProps) => {
  return (
    <VideoFeedContext.Provider value={{ cacheKey }}>
      <VideoList {...videoListProps} />
    </VideoFeedContext.Provider>
  );
};

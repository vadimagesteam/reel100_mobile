import { useVideoPause } from '../hooks/useVideoPause.ts';
import { ReactNode, useEffect } from 'react';
import { VideoFeedProvider } from './VideoFeedProvider';

export interface TabAwareVideoFeedProvider {
  isActiveTab: boolean;
  children: ReactNode;
}

const WithAutoPause = ({ isActiveTab, children }: TabAwareVideoFeedProvider) => {
  // Stop video player if tab changed
  const { setIsPaused } = useVideoPause();
  useEffect(() => {
    setIsPaused(!isActiveTab);
  }, [isActiveTab, setIsPaused]);

  return children;
};

export const TabAwareVideoFeedProvider = ({ isActiveTab, children }: TabAwareVideoFeedProvider) => {
  return (
    <VideoFeedProvider>
      <WithAutoPause isActiveTab={isActiveTab}>{children}</WithAutoPause>
    </VideoFeedProvider>
  );
};

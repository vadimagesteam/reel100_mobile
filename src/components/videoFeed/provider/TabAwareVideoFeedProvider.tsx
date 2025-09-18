import { ReactNode, useEffect } from 'react';
import { useVideoPause } from '../hooks';
import { VideoFeedProvider, VideoFeedProviderProps } from './VideoFeedProvider';

export interface TabAwareVideoFeedProvider {
  isActiveTab: boolean;
  children: ReactNode;
  initialState?: VideoFeedProviderProps['initialState'];
}

const WithAutoPause = ({ isActiveTab, children }: TabAwareVideoFeedProvider) => {
  // Stop video player if tab changed
  const { setIsPaused } = useVideoPause();
  useEffect(() => {
    setIsPaused(!isActiveTab);
  }, [isActiveTab, setIsPaused]);

  return children;
};

export const TabAwareVideoFeedProvider = ({
  isActiveTab,
  initialState,
  children,
}: TabAwareVideoFeedProvider) => {
  return (
    <VideoFeedProvider initialState={initialState}>
      <WithAutoPause isActiveTab={isActiveTab}>{children}</WithAutoPause>
    </VideoFeedProvider>
  );
};

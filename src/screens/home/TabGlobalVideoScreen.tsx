import { Top100VideosByDate } from '../../components/top100/Top100VideosByDate';
import { AppHeader, AppHeaderHeight } from '../../components/appHeader';
import { HidebleContainer } from '../../components/hidebleContainer';
import { VideoFeedProvider } from '../../components/videoFeed';

export const TabGlobalVideoScreen = () => {
  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-background">
      <AppHeader />
      <VideoFeedProvider>
        <Top100VideosByDate />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

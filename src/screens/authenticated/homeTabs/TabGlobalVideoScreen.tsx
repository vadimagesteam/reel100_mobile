import { Top100VideosByDate } from '../../../components/top100/Top100VideosByDate.tsx';
import { AppHeader, AppHeaderHeight } from '../../../components/appHeader/AppHeader.tsx';
import { HidebleContainer } from '../../../components/hidebleContainer';
import { VideoFeedProvider } from '../../../components/videoFeed';

export const TabGlobalVideoScreen = () => {
  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-black4">
      <AppHeader stateSelect />
      <VideoFeedProvider>
        <Top100VideosByDate />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

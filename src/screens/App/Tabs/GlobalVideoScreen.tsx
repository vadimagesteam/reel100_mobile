import { Top100VideosByDate } from '../../../components/Top100/Top100VideosByDate.tsx';
import { AppHeader, AppHeaderHeight } from '../../../components/AppHeader/AppHeader.tsx';
import { HidebleContainer } from '../../../components/HidebleContainer';
import { VideoFeedProvider } from '../../../components/VideoFeed';

const GlobalVideoScreen = () => {
  return (
    <HidebleContainer hideOffset={AppHeaderHeight} className="flex-1 bg-black4">
      <AppHeader stateSelect />
      <VideoFeedProvider>
        <Top100VideosByDate />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

export default GlobalVideoScreen;

import { useMemo } from 'react';
import { HidebleContainer } from '../../components/hidebleContainer';
import { VideoFeedProvider, VideoList } from '../../components/videoFeed';
import { useNavigation, useRoute } from '../../navigation';

export const VideoModalScreen = () => {
  const { params } = useRoute<'VideoModal'>();
  const navigation = useNavigation();

  const videos = useMemo(() => [params.video], [params.video]);

  return (
    <HidebleContainer>
      <VideoFeedProvider
        initialState={{
          isPlayerFullScreen: true,
          cacheKey: ['video_modal'],
          backPressHandler: () => navigation.goBack(),
        }}
      >
        <VideoList initialVideoIndex={0} videos={videos} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

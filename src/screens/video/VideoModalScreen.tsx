import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import { HidebleContainer } from '../../components/hidebleContainer';
import { FlexLoading } from '../../components/ui';
import { VideoFeedProvider, VideoList } from '../../components/videoFeed';
import { apiVideosFetcher, VideoPost } from '../../components/videoFeed/queries/apiVideosFetcher';
import { useNavigation, useRoute } from '../../navigation';

export const VideoModalScreen = () => {
  const { params } = useRoute<'VideoModal'>();
  const navigation = useNavigation();

  const cacheKey = ['video_modal'];

  const { data: videos, isLoading } = useQuery({
    queryKey: cacheKey,
    queryFn: async (): Promise<VideoPost[]> => {
      if ('video' in params) {
        return [params.video];
      }
      return apiVideosFetcher({
        where: { 'where[id]': params.videoId },
        take: 1,
        skip: 0,
      });
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const commentId = 'commentId' in params ? params.commentId : null;

  if (isLoading || !videos) {
    return (
      <View className="flex-1 bg-background">
        <FlexLoading />
      </View>
    );
  }

  return (
    <HidebleContainer>
      <VideoFeedProvider
        initialState={{
          isPlayerFullScreen: true,
          commentsOpened: commentId ? { videoId: videos[0]?.id } : null,
          cacheKey,
          backPressHandler: () => navigation.goBack(),
        }}
      >
        <VideoList initialVideoIndex={0} videos={videos} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

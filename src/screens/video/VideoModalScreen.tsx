import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { HidebleContainer } from '../../components/hidebleContainer';
import { FlexLoading } from '../../components/ui';
import { VideoFeedProvider, VideoList } from '../../components/videoFeed';
import { apiVideosFetcher, VideoPost } from '../../components/videoFeed/queries/apiVideosFetcher';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useNavigation, useRoute } from '../../navigation';

export const VideoModalScreen = () => {
  const { params } = useRoute<'VideoModal'>();
  const navigation = useNavigation();
  const [videos, setVideos] = useState<VideoPost[]>(() =>
    'video' in params ? [params.video] : [],
  );

  const [loadVideo, isLoading] = useLoadingCallback(
    useCallback(async (videoId: string) => {
      const videoResponse = await apiVideosFetcher({
        where: {
          'where[id]': videoId,
        },
        take: 1,
        skip: 0,
      });
      setVideos(videoResponse);
    }, []),
  );

  useEffect(() => {
    if (!('video' in params)) {
      loadVideo(params.videoId);
    }
  }, [loadVideo, params]);

  const commentId = 'commentId' in params ? params.commentId : null;
  const videoId = videos[0]?.id;

  if (isLoading || !videoId) {
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
          commentsOpened: commentId
            ? {
                videoId,
              }
            : null,
          cacheKey: ['video_modal'],
          backPressHandler: () => navigation.goBack(),
        }}
      >
        <VideoList initialVideoIndex={0} videos={videos} />
      </VideoFeedProvider>
    </HidebleContainer>
  );
};

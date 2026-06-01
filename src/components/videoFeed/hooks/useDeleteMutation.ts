import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { VideoPost } from '../queries/apiVideosFetcher';
import { useVideoFeedCacheKey } from './useVideoFeedCacheKey';

type VideoDeleteArgs = {
  id: string;
  force?: boolean;
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  const videosKey = useVideoFeedCacheKey();

  return useMutation({
    mutationFn: async ({ id, force }: VideoDeleteArgs) => {
      const { data } = await api.delete(`/api/videos/${id}`, {
        params: force ? { force: 'true' } : undefined,
      });
      return data;
    },
    onMutate: async ({ id }) => {
      let prevVideos;
      if (videosKey) {
        prevVideos = queryClient.getQueryData<{ pages: VideoPost[][] } | VideoPost[] | undefined>(
          videosKey,
        );

        console.log('prevVideos', prevVideos);
        if (Array.isArray(prevVideos)) {
          queryClient.setQueryData(
            videosKey,
            prevVideos.filter((_v) => _v.id !== id),
          );
        } else if (prevVideos) {
          queryClient.setQueryData(videosKey, {
            ...prevVideos,
            pages: prevVideos.pages.map((page) => page.filter((_v) => _v.id !== id)),
          });
        }
      }

      return { prevVideos };
    },
    onError: (_err, _vars, context) => {
      if (videosKey && context?.prevVideos) {
        queryClient.setQueryData(videosKey, context.prevVideos);
      }
    },
    onSettled: () => {
      if (videosKey) {
        queryClient.invalidateQueries({ queryKey: videosKey });
      }
    },
    retry: 3,
  });
};

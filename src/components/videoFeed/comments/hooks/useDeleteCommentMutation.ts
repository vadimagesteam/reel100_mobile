import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { updateVideoCache, useVideoFeedCacheKey } from '../../hooks';
import { CommentType } from './useCommentsInfiniteQuery';

export type CommentMutationArgs = {
  id: string;
  videoId: string;
};

type CommentsCache = {
  pages: CommentType[][];
};

export const useCommentMutation = () => {
  const queryClient = useQueryClient();

  const videoKey = useVideoFeedCacheKey();

  const getQueryKey = (videoId: string) => ['comments', 'video', videoId];

  return useMutation({
    mutationFn: async ({ id }: CommentMutationArgs) => {
      const { data } = await api.delete(`/api/comments/${id}`);
      return data;
    },
    onMutate: async ({ id, videoId }) => {
      const key = getQueryKey(videoId);
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<CommentsCache | undefined>(key);

      if (prev) {
        queryClient.setQueryData(key, {
          ...prev,
          pages: prev.pages.map((cList) => cList.filter((c) => c.id !== id)),
        });
      }

      // Optimistic update for comment counter
      let videoPrev;
      if (videoKey) {
        videoPrev = updateVideoCache(videoKey, videoId, (v) => ({
          ...v,
          commentsCount: v.commentsCount - 1,
        }));
      }
      return { key, prev, videoKey, videoPrev };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);
      }
      if (context?.videoKey && context?.videoPrev) {
        queryClient.setQueryData(context.videoKey, context.videoPrev);
      }
    },
  });
};

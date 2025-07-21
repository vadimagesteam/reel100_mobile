import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../state/user/authStore';
import { api } from '../../../../lib/api';
import { updateVideoCache, useVideoFeedCacheKey } from '../../hooks';
import { CommentType } from './useCommentsInfiniteQuery';

export type CommentMutationArgs = {
  videoId: string;
  replyTo?: string;
  text: string;
};

type CommentsCache = {
  pages: CommentType[][];
};

export const useCommentMutation = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { id: userId } = user;

  const videoKey = useVideoFeedCacheKey();

  const getQueryKey = (videoId: string) => ['comments', 'video', videoId];

  return useMutation({
    mutationFn: async ({ videoId, text, replyTo }: CommentMutationArgs) => {
      const payload = {
        replyTo: replyTo ?? '',
        text,
        user: { id: userId },
        video: { id: videoId },
      };
      const { data } = await api.post('/api/comments', payload);
      return data;
    },
    onMutate: async ({ text, replyTo, videoId }) => {
      const key = getQueryKey(videoId);
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<CommentsCache | undefined>(key);

      if (prev) {
        const optimisticComment: CommentType = {
          id: `optimistic-${Math.random().toString()}`,
          user,
          video: { id: videoId },
          text,
          replyTo: replyTo ?? '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likesCount: 0,
          replies: [],
          repliesCount: 0,
        };

        queryClient.setQueryData(key, {
          ...prev,
          pages: prev.pages.map((p, idx) => {
            // For simple comments put at the top, for replies we can place at the bottom
            // const isAppropriatePage = replyTo ? idx === prev.pages.length - 1 : idx === 0;
            // Place user comment at the top of the cache
            if (idx === 0) {
              return [optimisticComment, ...p];
            }
            return p;
          }),
        });
      }

      // Optimistic update for comment counter
      let videoPrev;
      if (videoKey) {
        videoPrev = updateVideoCache(videoKey, videoId, (v) => ({
          ...v,
          commentsCount: v.commentsCount + 1,
        }));
      }

      return { key, prev, videoPrev };
    },
    onError: (_err, _vars, context) => {
      console.log('_err', _err);
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);
      }
    },
    onSuccess: (data, { videoId }) => {
      const key = getQueryKey(videoId);
      const prev = queryClient.getQueryData<CommentsCache | undefined>(key);

      if (!prev) {
        return;
      }

      const updatedPages = prev.pages.map((page) =>
        page.map((comment) => (comment.id.startsWith('optimistic-') ? { ...data, user } : comment)),
      );

      queryClient.setQueryData(key, {
        ...prev,
        pages: updatedPages,
      });
    },
    onSettled: (_data, _error, { videoId }) => {
      // const key = getQueryKey(videoId);
      // queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

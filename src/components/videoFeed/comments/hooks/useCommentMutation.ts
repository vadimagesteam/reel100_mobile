import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../state/user/authStore';
import { api } from '../../../../lib/api';
import { useVideoFeedCacheKey } from '../../hooks';
import { VideoPost } from '../../queries/apiVideosFetcher';
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
  const { id: userId, firstName, lastName } = useUser();

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
          user: { id: userId!, firstName, lastName },
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
        videoPrev = queryClient.getQueryData<{ pages: VideoPost[][] }>(videoKey);
        if (videoPrev) {
          queryClient.setQueryData<{ pages: VideoPost[][] }>(videoKey, (prevData) => {
            if (prevData) {
              return {
                ...prevData,
                pages: prevData.pages.map((p) => {
                  return p.map((_videoPost) =>
                    _videoPost.id === videoId
                      ? {
                          ..._videoPost,
                          commentsCount: _videoPost.commentsCount + 1,
                        }
                      : _videoPost,
                  );
                }),
              };
            }
          });
        }
      }

      return { key, prev, videoPrev };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);
      }
    },
    onSuccess: (data, { videoId }) => {
      const key = getQueryKey(videoId);
      const prev = queryClient.getQueryData<CommentsCache | undefined>(key);

      if (!prev) return;

      const updatedPages = prev.pages.map((page) =>
        page.map((comment) =>
          comment.id.startsWith('optimistic-')
            ? { ...data, user: { id: userId, firstName, lastName } }
            : comment,
        ),
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

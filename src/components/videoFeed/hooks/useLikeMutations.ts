import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '../../../lib/api';
import { useUser } from '../../../state/user/authStore';
import { useVideoFeedCacheKey } from './useVideoFeedCacheKey';
import { updateVideoCache } from './useVideosInfiniteQuery';

type LikeArgs = {
  type: 'video' | 'comment';
  id: string;
};

type LikeResponse = { id: string };

export const useLikeMutations = () => {
  const queryClient = useQueryClient();
  const { id: userId } = useUser();
  const videosKey = useVideoFeedCacheKey();

  const updateVideoLikesCount = (videoId: string, val: 1 | -1) => {
    return updateVideoCache(videosKey!, videoId, (video) => ({
      ...video,
      likesCount: video.likesCount + val,
    }));
  };

  const like = useMutation({
    mutationFn: async ({ type, id }: LikeArgs) => {
      const payload =
        type === 'video'
          ? { typeField: 'Like', video: { id }, user: { id: userId } }
          : { typeField: 'Like', comment: { id }, user: { id: userId } };

      const { data } = await api.post<LikeResponse>('/api/reactions', payload);
      return data;
    },
    onMutate: async ({ type, id }) => {
      const key = ['like', type, userId, id];
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<{ id: string } | undefined>(key);

      if (prev?.id !== null) {
        return { key, prev };
      }

      queryClient.setQueryData(key, { id: 'optimistic' });

      // Update video counter
      let videosPrev;
      if (videosKey && type === 'video') {
        videosPrev = updateVideoLikesCount(id, 1);
      }

      return { key, prev, videosPrev };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);

        // revert video cache back
        if (videosKey && context.videosPrev) {
          queryClient.setQueryData(videosKey, context.videosPrev);
        }
      }
    },
    onSuccess: (data, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.setQueryData(key, { id: data.id });
    },
    onSettled: (_data, _error, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.invalidateQueries({ queryKey: key });
    },
    retry: 3,
  });

  const unlike = useMutation({
    mutationFn: async ({ type, id }: LikeArgs) => {
      const key = ['like', type, userId, id];
      const cache = queryClient.getQueryData<{ id: string } | undefined>(key);
      if (cache?.id && cache?.id !== 'optimistic') {
        queryClient.removeQueries({ queryKey: key });
        await api.delete(`/api/reactions/${cache?.id}`);
      }
      return { id: null };
    },
    onMutate: ({ type, id }) => {
      const prev = queryClient.getQueryData<{ id: string } | undefined>(['like', type, userId, id]);

      let videosPrev;
      if (videosKey && type === 'video' && prev?.id) {
        videosPrev = updateVideoLikesCount(id, -1);
      }

      return {
        videosPrev,
      };
    },
    onError: (_err, _vars, context) => {
      // revert video cache back
      if (videosKey && context?.videosPrev) {
        queryClient.setQueryData(videosKey, context.videosPrev);
      }
    },
    onSettled: (_data, _err, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.invalidateQueries({ queryKey: key });
    },
    retry: 3,
  });

  const toggleLike = useCallback(
    ({ id, type }: LikeArgs) => {
      const key = ['like', type, userId, id];
      const prev = queryClient.getQueryData<{ id: string } | undefined>(key);

      const wasLiked = prev?.id;

      if (wasLiked) {
        return unlike.mutate({ type, id });
      }
      return like.mutate({ type, id });
    },
    [queryClient, unlike, like, userId],
  );

  return {
    like,
    unlike,
    toggleLike,
  };
};

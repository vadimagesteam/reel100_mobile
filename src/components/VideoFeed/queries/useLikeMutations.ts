import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '../../../lib/api.ts';
import { useUser } from '../../../state/user/authStore.ts';
import { VideoPost } from './apiVideosFetcher.ts';
import { useVideoFeed } from '../VideoFeed.tsx';

type LikeArgs = {
  type: 'video' | 'comment';
  id: string;
};

type LikeResponse = { id: string };

export const useLikeMutations = () => {
  const queryClient = useQueryClient();
  const { id: userId } = useUser();
  const { cacheKey: videosKey } = useVideoFeed();

  const updateVideoLikesCount = (videoId: string, val: 1 | -1) => {
    const videoPages = queryClient.getQueryData<{ pages: VideoPost[][] } | undefined>(videosKey);
    if (videoPages?.pages) {
      queryClient.setQueryData(videosKey, {
        ...videoPages,
        pages: videoPages.pages.map((page) =>
          page.map((video) =>
            video.id === videoId ? { ...video, likesCount: video.likesCount + val } : video,
          ),
        ),
      });
    }
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
      if (type === 'video') {
        updateVideoLikesCount(id, 1);
      }

      return { key, prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);
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

      // Update video counter
      if (type === 'video' && prev?.id) {
        updateVideoLikesCount(id, -1);
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

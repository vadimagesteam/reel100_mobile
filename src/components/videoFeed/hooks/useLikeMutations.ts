import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '../../../lib/api';
import { useUser, useAuthActions } from '../../../state/user/authStore';
import { UserType } from '../../../state/user/types';
import { useVideoFeedCacheKey } from './useVideoFeedCacheKey';
import { updateVideoCache } from './useVideosInfiniteQuery';

type LikeArgs = {
  type: 'video' | 'comment';
  id: string;
  authorId: string; // if we want to update user profile stats cache
};

type LikeResponse = { id: string };

export const useLikeMutations = () => {
  const queryClient = useQueryClient();
  const { id: userId } = useUser();
  const { updateMyProfileStats } = useAuthActions();
  const videosKey = useVideoFeedCacheKey();

  const updateVideoLikesCount = (videoId: string, val: 1 | -1) => {
    return updateVideoCache(videosKey!, videoId, (video) => ({
      ...video,
      likesCount: video.likesCount + val,
    }));
  };

  // A video like/unlike shifts the search recommendation scores (score uses
  // likes) and the liked user's total-likes shown in combined search. Mark
  // those stale so the search screens refetch fresh numbers next time they
  // open. Skipped on error (nothing changed) and for comment likes (the
  // backend only refreshes search stats for video Like reactions). The
  // Choose-Your-State counts are upload-based, so a like leaves them untouched.
  const invalidateSearchOnVideoLike = (type: 'video' | 'comment', error: unknown) => {
    if (error || type !== 'video') {
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['search', 'recommendations'] });
    queryClient.invalidateQueries({ queryKey: ['search', 'combined'] });
  };

  const updateUserProfileLikesCount = (authorId: string, val: 1 | -1) => {
    // for own profile, we need to update zustand cache
    if (authorId === userId) {
      updateMyProfileStats((stats) => ({
        ...stats,
        likeCount: stats.likeCount + val,
      }));
      return undefined;
    }

    const prev = queryClient.getQueryData<UserType>(['user', authorId]);
    if (prev) {
      queryClient.setQueryData<UserType>(['user', authorId], (cache) => {
        if (!cache) {
          return cache;
        }
        return {
          ...cache,
          stats: {
            ...cache.stats,
            likeCount: cache.stats.likeCount + val,
          },
        };
      });
    }

    return prev;
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
    onMutate: async ({ type, id, authorId }) => {
      const key = ['like', type, userId, id];
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<{ id: string } | undefined>(key);

      // Skip the optimistic write only if a like is already recorded. The old
      // guard read `prev?.id !== null`, but an unliked item has no cache entry
      // so `prev?.id` is undefined, not null — the guard was truthy and
      // returned early on the very first like, so the count never moved
      // optimistically until a refetch.
      if (prev?.id) {
        return { key, prev };
      }

      queryClient.setQueryData(key, { id: 'optimistic' });

      // Update video counter
      let videosPrev;
      if (videosKey && type === 'video') {
        videosPrev = updateVideoLikesCount(id, 1);
      }

      const authorPrev = updateUserProfileLikesCount(authorId, 1);

      return { key, prev, videosPrev, authorPrev };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);
      }
      // revert video cache back
      if (videosKey && context?.videosPrev) {
        queryClient.setQueryData(videosKey, context.videosPrev);
      }
      // revert the author's profile-stats cache — restore authorPrev, not
      // videosPrev, which would write video-feed data into the user cache.
      if (context?.authorPrev) {
        queryClient.setQueryData(['user', _vars.authorId], context.authorPrev);
      }
    },
    onSuccess: (data, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.setQueryData(key, { id: data.id });
    },
    onSettled: (_data, error, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.invalidateQueries({ queryKey: key });
      invalidateSearchOnVideoLike(type, error);
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
    onMutate: ({ type, id, authorId }) => {
      const prev = queryClient.getQueryData<{ id: string } | undefined>(['like', type, userId, id]);

      let videosPrev;
      if (videosKey && type === 'video' && prev?.id) {
        videosPrev = updateVideoLikesCount(id, -1);
      }

      const authorPrev = updateUserProfileLikesCount(authorId, -1);

      return {
        videosPrev,
        authorPrev,
      };
    },
    onError: (_err, _vars, context) => {
      // revert video cache back
      if (videosKey && context?.videosPrev) {
        queryClient.setQueryData(videosKey, context.videosPrev);
      }
      // revert the author's profile-stats cache — restore authorPrev, not
      // videosPrev, which would write video-feed data into the user cache.
      if (context?.authorPrev) {
        queryClient.setQueryData(['user', _vars.authorId], context.authorPrev);
      }
    },
    onSettled: (_data, error, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.invalidateQueries({ queryKey: key });
      invalidateSearchOnVideoLike(type, error);
    },
    retry: 3,
  });

  const toggleLike = useCallback(
    ({ id, type, authorId }: LikeArgs) => {
      const key = ['like', type, userId, id];
      const prev = queryClient.getQueryData<{ id: string } | undefined>(key);

      const wasLiked = prev?.id;

      if (wasLiked) {
        return unlike.mutate({ type, id, authorId });
      }
      return like.mutate({ type, id, authorId });
    },
    [queryClient, unlike, like, userId],
  );

  return {
    like,
    unlike,
    toggleLike,
  };
};

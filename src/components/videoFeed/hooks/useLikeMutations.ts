import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '../../../lib/api';
import { useUser, useAuthActions } from '../../../state/user/authStore';
import { UserType } from '../../../state/user/types';
import { useVideoFeedCacheKey } from './useVideoFeedCacheKey';
import { FOR_YOU_CACHE_KEY, updateVideoCache } from './useVideosInfiniteQuery';
import { commentsCacheKey, updateCommentCache } from '../comments/hooks/useCommentsInfiniteQuery';

type LikeArgs = {
  type: 'video' | 'comment';
  id: string;
  authorId: string; // if we want to update user profile stats cache
  videoId?: string; // required for comment likes, to locate the comments cache
  reactionId?: string; // for comment unlike: the reaction id to DELETE, passed
  // straight from the list so it never depends on a separate cache staying in sync
};

type LikeResponse = { id: string };

// Rollback context returned from the optimistic count update, so onError can
// restore whichever cache (video feed or comments list) was touched.
type CountContext = { countKey?: readonly unknown[]; countPrev?: unknown };
// Rollback context for the author's profile-stats update.
type ProfileContext = { authorPrev?: UserType; ownDelta?: 1 | -1 };
// Full context threaded from onMutate to onError.
type LikeContext = CountContext & {
  key?: string[];
  prev?: { id: string } | undefined;
  profile?: ProfileContext;
};

export const useLikeMutations = () => {
  const queryClient = useQueryClient();
  const { id: userId } = useUser();
  const { updateMyProfileStats } = useAuthActions();
  const videosKey = useVideoFeedCacheKey();

  // Optimistically move the like counter on whichever entity was liked, and
  // return the cache key + previous snapshot so onError can roll it back.
  // Video counts live in the video-feed cache; comment counts live in the
  // per-video comments cache.
  const updateTargetLikesCount = (args: LikeArgs, val: 1 | -1): CountContext => {
    if (args.type === 'video') {
      if (!videosKey) {
        return {};
      }
      const countPrev = updateVideoCache(videosKey, args.id, (video) => ({
        ...video,
        likesCount: video.likesCount + val,
      }));
      return { countKey: videosKey, countPrev };
    }

    // comment
    if (!args.videoId) {
      return {};
    }
    const key = commentsCacheKey(args.videoId);
    const countPrev = updateCommentCache(key, args.id, (comment) => ({
      ...comment,
      likesCount: (comment.likesCount ?? 0) + val,
      likedByMe: val > 0,
    }));
    return { countKey: key, countPrev };
  };

  // A video like/unlike shifts the search recommendation scores (score uses
  // likes) and the liked user's total-likes shown in combined search. It also
  // moves the liker's tag affinities, which is what the server ranks the 4U
  // feed by — so the cached 4U pages no longer reflect what the user is
  // interested in. Mark all of it stale. Skipped on error (nothing changed)
  // and for comment likes (the backend only refreshes search stats, and only
  // records affinity, for video Like reactions). The Choose-Your-State counts
  // are upload-based, so a like leaves them untouched.
  const invalidateOnVideoLike = (type: 'video' | 'comment', error: unknown) => {
    if (error || type !== 'video') {
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['search', 'recommendations'] });
    queryClient.invalidateQueries({ queryKey: ['search', 'combined'] });

    // Deliberately no refetch: the like usually happens inside the 4U feed
    // itself, and refetching would reorder the list under the user's thumb
    // mid-scroll. Marking it stale is enough — TabForYouScreen drops every
    // page but the first and refetches on mount, and pull-to-refresh is
    // always there, so the new order lands on the next visit instead.
    queryClient.invalidateQueries({
      queryKey: FOR_YOU_CACHE_KEY,
      refetchType: 'none',
    });
  };

  // The profile `likeCount` stat counts likes on the user's VIDEOS (see the
  // backend buildStats), so this is only called for video likes — a comment
  // like must not touch it. Returns a rollback context: ownDelta for the
  // zustand-backed own profile (reverted by applying the inverse delta), or
  // authorPrev for another user's cached profile.
  const updateUserProfileLikesCount = (authorId: string, val: 1 | -1): ProfileContext => {
    if (authorId === userId) {
      updateMyProfileStats((stats) => ({
        ...stats,
        likeCount: stats.likeCount + val,
      }));
      return { ownDelta: val };
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

    return { authorPrev: prev };
  };

  // Undo the profile-stats change on a failed mutation.
  const revertUserProfileLikesCount = (authorId: string, context?: ProfileContext) => {
    if (!context) {
      return;
    }
    if (context.ownDelta) {
      updateMyProfileStats((stats) => ({
        ...stats,
        likeCount: stats.likeCount - context.ownDelta!,
      }));
      return;
    }
    if (context.authorPrev) {
      queryClient.setQueryData(['user', authorId], context.authorPrev);
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
    onMutate: async (vars): Promise<LikeContext> => {
      const { type, id, authorId } = vars;
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

      const count = updateTargetLikesCount(vars, 1);

      // Profile stat is video-only (a comment like is not a video like).
      const profile = type === 'video' ? updateUserProfileLikesCount(authorId, 1) : undefined;

      return { key, prev, ...count, profile };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context?.prev) {
        queryClient.setQueryData(context.key, context.prev);
      }
      // revert the like counter (video feed or comments) back
      if (context?.countKey && context?.countPrev !== undefined) {
        queryClient.setQueryData(context.countKey, context.countPrev);
      }
      revertUserProfileLikesCount(_vars.authorId, context?.profile);
    },
    onSuccess: (data, { type, id, videoId }) => {
      const key = ['like', type, userId, id];
      queryClient.setQueryData(key, { id: data.id });

      // Record the server reaction id on the comment itself so a later unlike
      // in the same session can DELETE it without re-fetching. The comment list
      // is the single source of truth for the heart; keep it authoritative.
      if (type === 'comment' && videoId) {
        updateCommentCache(commentsCacheKey(videoId), id, (comment) => ({
          ...comment,
          likedByMe: true,
          myReactionId: data.id,
        }));
      }
    },
    onSettled: (_data, error, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.invalidateQueries({ queryKey: key });
      invalidateOnVideoLike(type, error);
    },
    retry: 3,
  });

  const unlike = useMutation({
    mutationFn: async ({ type, id, reactionId }: LikeArgs) => {
      const key = ['like', type, userId, id];
      // Prefer an explicitly-passed reaction id — the comment path passes the
      // fresh id straight from the list — and fall back to the like cache for
      // the video path. Crucially, do NOT remove the cache key here: the
      // previous version removed it before the DELETE, so on a transient
      // failure retry re-ran with the key already gone, skipped the DELETE,
      // and resolved as success — leaving the reaction alive on the server
      // while the UI showed it unliked. The key is cleared in onSuccess, after
      // the DELETE actually lands, so retries keep targeting the same id.
      const targetId = reactionId ?? queryClient.getQueryData<{ id: string } | undefined>(key)?.id;
      if (targetId && targetId !== 'optimistic') {
        await api.delete(`/api/reactions/${targetId}`);
      }
      return { id: null };
    },
    onMutate: (vars) => {
      const { type, id, authorId } = vars;
      const prev = queryClient.getQueryData<{ id: string } | undefined>(['like', type, userId, id]);

      // Only move counters if a like was actually recorded.
      const count = prev?.id ? updateTargetLikesCount(vars, -1) : {};

      const profile =
        type === 'video' && prev?.id ? updateUserProfileLikesCount(authorId, -1) : undefined;

      return { ...count, profile };
    },
    onError: (_err, _vars, context) => {
      // revert the like counter (video feed or comments) back
      if (context?.countKey && context?.countPrev !== undefined) {
        queryClient.setQueryData(context.countKey, context.countPrev);
      }
      revertUserProfileLikesCount(_vars.authorId, context?.profile);
    },
    onSuccess: (_data, { type, id, videoId }) => {
      // Clear the like-state key now that the DELETE has landed (moved out of
      // mutationFn so retries stay safe — see the note there).
      queryClient.setQueryData(['like', type, userId, id], { id: null });

      if (type === 'comment' && videoId) {
        updateCommentCache(commentsCacheKey(videoId), id, (comment) => ({
          ...comment,
          likedByMe: false,
          myReactionId: null,
        }));
      }
    },
    onSettled: (_data, error, { type, id }) => {
      const key = ['like', type, userId, id];
      queryClient.invalidateQueries({ queryKey: key });
      invalidateOnVideoLike(type, error);
    },
    retry: 3,
  });

  const toggleLike = useCallback(
    ({ id, type, authorId, videoId }: LikeArgs) => {
      const key = ['like', type, userId, id];
      const prev = queryClient.getQueryData<{ id: string } | undefined>(key);

      const wasLiked = prev?.id;

      if (wasLiked) {
        return unlike.mutate({ type, id, authorId, videoId });
      }
      return like.mutate({ type, id, authorId, videoId });
    },
    [queryClient, unlike, like, userId],
  );

  return {
    like,
    unlike,
    toggleLike,
  };
};

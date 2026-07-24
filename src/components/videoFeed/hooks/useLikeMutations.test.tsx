/**
 * Regression cover for two latent bugs in useLikeMutations, fixed before the
 * comment-like UI reuses this hook:
 *
 *  1. onError restored context.videosPrev into the ['user', authorId] cache
 *     instead of context.authorPrev, writing video-feed data into the
 *     user-profile entry on any failed like/unlike.
 *  2. The onMutate guard read `prev?.id !== null`; an unliked item has no
 *     cache entry so prev?.id is undefined, making the guard truthy and
 *     skipping the optimistic update on the very first like.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockPost = jest.fn();
const mockDelete = jest.fn();
const mockUpdateVideoCache = jest.fn();
const mockUpdateMyProfileStats = jest.fn();

jest.mock('../../../lib/api', () => ({
  api: {
    post: (...args: unknown[]) => mockPost(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

jest.mock('../../../state/user/authStore', () => ({
  useUser: () => ({ id: 'me' }),
  useAuthActions: () => ({ updateMyProfileStats: mockUpdateMyProfileStats }),
}));

jest.mock('./useVideoFeedCacheKey', () => ({
  useVideoFeedCacheKey: () => ['videos', 'feed'],
}));

const mockForYouKey = ['for_you_videos'];

jest.mock('./useVideosInfiniteQuery', () => ({
  FOR_YOU_CACHE_KEY: mockForYouKey,
  updateVideoCache: (...args: unknown[]) => mockUpdateVideoCache(...args),
}));

const mockUpdateCommentCache = jest.fn();

jest.mock('../comments/hooks/useCommentsInfiniteQuery', () => ({
  commentsCacheKey: (videoId: string) => ['comments', 'video', videoId],
  updateCommentCache: (...args: unknown[]) => mockUpdateCommentCache(...args),
}));

// Imported after the mocks.
const { useLikeMutations } = require('./useLikeMutations');

function renderLikeHook(client: QueryClient) {
  const ref: { current: ReturnType<typeof useLikeMutations> } = { current: undefined as any };
  function Harness() {
    ref.current = useLikeMutations();
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      React.createElement(QueryClientProvider, { client }, React.createElement(Harness)),
    );
  });
  return ref;
}

const flush = async () => {
  // Advance through the mutation's retry backoff (retry: 3, exponential) and
  // flush the promise microtasks each mutation callback schedules.
  await ReactTestRenderer.act(async () => {
    await jest.advanceTimersByTimeAsync(10000);
  });
};

let client: QueryClient;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // updateVideoCache returns the pre-mutation snapshot the real one would.
  mockUpdateVideoCache.mockReturnValue({ pages: 'VIDEO_CACHE_SNAPSHOT' });
  mockUpdateCommentCache.mockReturnValue({ pages: 'COMMENT_CACHE_SNAPSHOT' });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useLikeMutations — bug 2: first optimistic like', () => {
  it('applies the optimistic update on the very first like', async () => {
    mockPost.mockResolvedValue({ data: { id: 'reaction-1' } });
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({ type: 'video', id: 'v1', authorId: 'other' });
    });
    await flush();

    // The optimistic path ran: it seeded the like key and bumped the video
    // counter. The old guard returned early here, so neither happened until a
    // later refetch.
    expect(mockUpdateVideoCache).toHaveBeenCalledWith(
      ['videos', 'feed'],
      'v1',
      expect.any(Function),
    );
    // And the increment closure adds one.
    const updater = mockUpdateVideoCache.mock.calls[0][2] as (v: any) => any;
    expect(updater({ likesCount: 4 }).likesCount).toBe(5);
  });

  it('records the real reaction id after the server responds', async () => {
    mockPost.mockResolvedValue({ data: { id: 'reaction-1' } });
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({ type: 'video', id: 'v1', authorId: 'other' });
    });
    await flush();

    expect(client.getQueryData(['like', 'video', 'me', 'v1'])).toEqual({ id: 'reaction-1' });
  });
});

describe('useLikeMutations — bug 1: onError restores the right cache', () => {
  const PROFILE = { id: 'author-1', stats: { likeCount: 5 }, username: 'a' };

  it('restores the author profile (not video data) when a like fails', async () => {
    client.setQueryData(['user', 'author-1'], PROFILE);
    mockPost.mockRejectedValue(new Error('network'));

    const hook = renderLikeHook(client);
    ReactTestRenderer.act(() => {
      hook.current.like.mutate({ type: 'video', id: 'v1', authorId: 'author-1' });
    });
    await flush();

    const restored = client.getQueryData(['user', 'author-1']) as typeof PROFILE;
    // The bug wrote context.videosPrev here, corrupting the profile with the
    // video-feed snapshot.
    expect(restored).not.toEqual({ pages: 'VIDEO_CACHE_SNAPSHOT' });
    // Optimistic +1 is rolled back to the original count.
    expect(restored.stats.likeCount).toBe(5);
    expect(restored.username).toBe('a');
  });

  // Note: unlike's onError restore uses the identical (now fixed) pattern as
  // like's, but it is hard to exercise through mutate() — unlike removes the
  // like key before calling DELETE, so on retry the key is gone and the
  // mutation resolves as a success instead of erroring. The like-failure test
  // above covers the corrected restore line; here we just confirm unlike's
  // optimistic decrement targets the author profile, not the video snapshot.
  it('decrements the author profile optimistically on unlike', async () => {
    client.setQueryData(['user', 'author-1'], PROFILE);
    client.setQueryData(['like', 'video', 'me', 'v1'], { id: 'reaction-1' });
    mockDelete.mockResolvedValue({ data: {} });

    const hook = renderLikeHook(client);
    ReactTestRenderer.act(() => {
      hook.current.unlike.mutate({ type: 'video', id: 'v1', authorId: 'author-1' });
    });
    await flush();

    const profile = client.getQueryData(['user', 'author-1']) as typeof PROFILE;
    expect(profile.stats.likeCount).toBe(4);
    expect(profile.username).toBe('a');
  });
});

describe('useLikeMutations — comment likes', () => {
  it('updates the comment count optimistically, not the video feed', async () => {
    mockPost.mockResolvedValue({ data: { id: 'reaction-c1' } });
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({
        type: 'comment',
        id: 'c1',
        authorId: 'other',
        videoId: 'v1',
      });
    });
    await flush();

    expect(mockUpdateCommentCache).toHaveBeenCalledWith(
      ['comments', 'video', 'v1'],
      'c1',
      expect.any(Function),
    );
    // The video feed cache is untouched for a comment like.
    expect(mockUpdateVideoCache).not.toHaveBeenCalled();

    // The updater bumps likesCount and marks it liked.
    const updater = mockUpdateCommentCache.mock.calls[0][2] as (c: any) => any;
    const next = updater({ likesCount: 2, likedByMe: false });
    expect(next.likesCount).toBe(3);
    expect(next.likedByMe).toBe(true);
  });

  it('does not touch the author profile stat for a comment like', async () => {
    // Author's profile is cached, so a stray stat bump would be observable.
    client.setQueryData(['user', 'author-1'], { id: 'author-1', stats: { likeCount: 7 } });
    mockPost.mockResolvedValue({ data: { id: 'reaction-c1' } });
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({
        type: 'comment',
        id: 'c1',
        authorId: 'author-1',
        videoId: 'v1',
      });
    });
    await flush();

    // A comment like is not a video like; the profile likeCount (likes on your
    // videos) must not move — for cached other users or the zustand own profile.
    expect(mockUpdateMyProfileStats).not.toHaveBeenCalled();
    const profile = client.getQueryData(['user', 'author-1']) as { stats: { likeCount: number } };
    expect(profile.stats.likeCount).toBe(7);
  });

  it('rolls the comment count back when the like fails', async () => {
    mockPost.mockRejectedValue(new Error('network'));
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({
        type: 'comment',
        id: 'c1',
        authorId: 'other',
        videoId: 'v1',
      });
    });
    await flush();

    // Restored to the snapshot updateCommentCache returned at mutate time.
    expect(client.getQueryData(['comments', 'video', 'v1'])).toEqual({
      pages: 'COMMENT_CACHE_SNAPSHOT',
    });
  });
});

describe('useLikeMutations — own-content like revert', () => {
  it('reverts the zustand profile stat when a like on your own video fails', async () => {
    mockPost.mockRejectedValue(new Error('network'));
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      // authorId === the mocked current user id ('me').
      hook.current.like.mutate({ type: 'video', id: 'v1', authorId: 'me' });
    });
    await flush();

    // Optimistic +1 then revert -1 — two calls whose net effect is zero.
    expect(mockUpdateMyProfileStats).toHaveBeenCalledTimes(2);
    const net = mockUpdateMyProfileStats.mock.calls
      .map((c) => c[0] as (s: any) => any)
      .reduce((stats, fn) => fn(stats), { likeCount: 10 });
    expect(net.likeCount).toBe(10);
  });
});

describe('useLikeMutations — retry-safe unlike (review issue 1)', () => {
  it('re-attempts the DELETE on a transient failure instead of silently succeeding', async () => {
    // First DELETE rejects, retry succeeds. The old code removed the like key
    // before the DELETE, so the retry skipped it and the reaction survived.
    mockDelete
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce({ data: {} });
    client.setQueryData(['like', 'video', 'me', 'v1'], { id: 'reaction-1' });

    const hook = renderLikeHook(client);
    ReactTestRenderer.act(() => {
      hook.current.unlike.mutate({ type: 'video', id: 'v1', authorId: 'other' });
    });
    await flush();

    // The DELETE was actually retried and hit the real reaction id both times.
    expect(mockDelete).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenLastCalledWith('/api/reactions/reaction-1');
  });
});

describe('useLikeMutations — comment unlike uses the passed reaction id', () => {
  it('DELETEs the reaction id from the list, not a cached mirror', async () => {
    mockDelete.mockResolvedValue({ data: {} });
    // No ['like'] cache seeded at all — the id comes only from the args.
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.unlike.mutate({
        type: 'comment',
        id: 'c1',
        authorId: 'other',
        videoId: 'v1',
        reactionId: 'reaction-c1',
      });
    });
    await flush();

    expect(mockDelete).toHaveBeenCalledWith('/api/reactions/reaction-c1');
    // On success it clears the like-state key and marks the comment unliked.
    expect(mockUpdateCommentCache).toHaveBeenCalledWith(
      ['comments', 'video', 'v1'],
      'c1',
      expect.any(Function),
    );
    const updater = mockUpdateCommentCache.mock.calls.at(-1)![2] as (c: any) => any;
    const next = updater({ likedByMe: true, myReactionId: 'reaction-c1' });
    expect(next.likedByMe).toBe(false);
    expect(next.myReactionId).toBeNull();
  });
});

describe('useLikeMutations — 4U feed staleness', () => {
  // Seed the 4U cache the way the feed screen would, so invalidation has
  // something real to act on.
  const seedForYou = () => {
    client.setQueryData(mockForYouKey, { pages: [[{ id: 'v1' }]], pageParams: [0] });
  };

  it('marks the 4U feed stale after a video like, without refetching it', async () => {
    mockPost.mockResolvedValue({ data: { id: 'reaction-1' } });
    seedForYou();
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({ type: 'video', id: 'v1', authorId: 'other' });
    });
    await flush();

    const state = client.getQueryState(mockForYouKey)!;
    // Stale, so the next mount picks up the new ranking...
    expect(state.isInvalidated).toBe(true);
    // ...but not refetched now: the like usually happens inside 4U itself and
    // a refetch would reorder the list mid-scroll.
    expect(state.fetchStatus).toBe('idle');
    expect(state.data).toEqual({ pages: [[{ id: 'v1' }]], pageParams: [0] });
  });

  it('leaves the 4U feed alone for a comment like', async () => {
    mockPost.mockResolvedValue({ data: { id: 'reaction-1' } });
    seedForYou();
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({ type: 'comment', id: 'c1', authorId: 'other', videoId: 'v1' });
    });
    await flush();

    // The backend only records tag affinity for video likes.
    expect(client.getQueryState(mockForYouKey)!.isInvalidated).toBe(false);
  });

  it('leaves the 4U feed alone when the like fails', async () => {
    mockPost.mockRejectedValue(new Error('network'));
    seedForYou();
    const hook = renderLikeHook(client);

    ReactTestRenderer.act(() => {
      hook.current.like.mutate({ type: 'video', id: 'v1', authorId: 'other' });
    });
    await flush();

    // Nothing was recorded server-side, so the ranking has not moved.
    expect(client.getQueryState(mockForYouKey)!.isInvalidated).toBe(false);
  });
});

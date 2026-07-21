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

jest.mock('./useVideosInfiniteQuery', () => ({
  updateVideoCache: (...args: unknown[]) => mockUpdateVideoCache(...args),
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

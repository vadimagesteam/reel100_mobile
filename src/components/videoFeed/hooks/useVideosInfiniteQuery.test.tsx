/**
 * Regression cover for the 4U staleness fix.
 *
 * Liking a video marks the personalized feed stale (see useLikeMutations) with
 * `refetchType: 'none'`, on the assumption that nothing refetches until the
 * feed screen asks. That assumption was wrong: React Query's default
 * `refetchOnMount` refetches an invalidated query as soon as ANY new observer
 * mounts, and the video-feed modal mounts a second observer on the cache key
 * the grid behind it is still using — so every loaded page was refetched and
 * the list reordered under the user mid-scroll.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockFetcher = jest.fn();
const mockQueryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

jest.mock('../queries/apiVideosFetcher', () => ({
  apiVideosFetcher: (...args: unknown[]) => mockFetcher(...args),
}));

jest.mock('../../../lib/api', () => ({ queryClient: mockQueryClient }));

// Imported after the mocks.
const { useVideosInfiniteQuery } = require('./useVideosInfiniteQuery');

const CACHE_KEY = ['for_you_videos'];

function mountFeed(refetchFirstPageOnMount: boolean, params: Record<string, unknown> = {}) {
  function Harness() {
    useVideosInfiniteQuery({
      cacheKey: CACHE_KEY,
      where: { forMe: true },
      refetchFirstPageOnMount,
      ...params,
    });
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      React.createElement(
        QueryClientProvider,
        { client: mockQueryClient },
        React.createElement(Harness),
      ),
    );
  });
}

const flush = async () => {
  await ReactTestRenderer.act(async () => {
    await jest.advanceTimersByTimeAsync(1000);
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockQueryClient.clear();
  mockFetcher.mockResolvedValue([{ id: 'v1' }]);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useVideosInfiniteQuery — a second observer on a stale shared feed', () => {
  it('does not refetch when the modal mounts on an invalidated feed', async () => {
    // The 4U grid loads its first page.
    mountFeed(true);
    await flush();
    const afterGrid = mockFetcher.mock.calls.length;
    expect(afterGrid).toBeGreaterThan(0);

    // A like marks the feed stale, without refetching it now.
    await mockQueryClient.invalidateQueries({ queryKey: CACHE_KEY, refetchType: 'none' });
    await flush();
    expect(mockFetcher.mock.calls.length).toBe(afterGrid);

    // The video-feed modal opens on the same cache key. It must leave the
    // shared pages exactly as they are — this is where the reorder came from.
    mountFeed(false);
    await flush();

    expect(mockFetcher.mock.calls.length).toBe(afterGrid);
    expect(mockQueryClient.getQueryState(CACHE_KEY)?.isInvalidated).toBe(true);
  });

  it('still refreshes the feed for a screen that asks for it on mount', async () => {
    mountFeed(true);
    await flush();
    const afterFirst = mockFetcher.mock.calls.length;

    // Same screen reopened: it does want fresh data, and asks explicitly
    // rather than relying on React Query's mount behaviour.
    mountFeed(true);
    await flush();

    expect(mockFetcher.mock.calls.length).toBeGreaterThan(afterFirst);
  });
});

describe('useVideosInfiniteQuery — the hashtag page', () => {
  it('forwards tags and the sort to the fetcher', async () => {
    // Without these the fetcher takes its GraphQL branch with an empty filter,
    // which is why every hashtag page listed the same videos and why the
    // Top/Recent tabs appeared to do nothing.
    mountFeed(true, { tags: ['basketball'], tagSort: 'recent' });
    await flush();

    expect(mockFetcher).toHaveBeenCalledWith(
      expect.objectContaining({ tags: ['basketball'], tagSort: 'recent' }),
    );
  });
});

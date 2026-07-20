/**
 * Guards the "can't scroll up to earlier videos from a profile grid" bug.
 *
 * Tapping the third tile used to open a feed built from
 * `flatPages.slice(videoIndex)` with `initialVideoIndex={0}` — the videos above
 * the tapped one were physically absent from the list, so there was nothing to
 * scroll back up to. The feed must receive the whole list and be told where to
 * start instead.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockFlatPages = [
  { id: 'v0' },
  { id: 'v1' },
  { id: 'v2' },
  { id: 'v3' },
  { id: 'v4' },
];

let mockRouteParams: any = {};

jest.mock('../../navigation', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({ params: mockRouteParams }),
}));

const mockUseVideosInfiniteQuery = jest.fn((_params: any) => ({
  flatPages: mockFlatPages,
  refetch: jest.fn(),
  fetchNextPage: jest.fn(),
  isFetchingNextPage: false,
  hasNextPage: false,
}));

jest.mock('../../components/videoFeed/hooks', () => ({
  useVideosInfiniteQuery: (params: any) => mockUseVideosInfiniteQuery(params),
}));

jest.mock('../../hooks/useLoadingCallback', () => ({
  useLoadingCallback: (fn: any) => [fn, false],
}));

jest.mock('../../components/hidebleContainer', () => ({
  HidebleContainer: ({ children }: any) => children,
}));

// Capture the props VideoList is rendered with.
const mockVideoListProps: any[] = [];

jest.mock('../../components/videoFeed', () => ({
  VideoFeedProvider: ({ children }: any) => children,
  VideoList: (props: any) => {
    mockVideoListProps.push(props);
    return null;
  },
}));

const { VideoFeedModalScreen } = require('./VideoFeedModalScreen');

const render = async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(React.createElement(VideoFeedModalScreen, null));
  });
  return mockVideoListProps[mockVideoListProps.length - 1];
};

beforeEach(() => {
  mockVideoListProps.length = 0;
  mockUseVideosInfiniteQuery.mockClear();
  mockRouteParams = {
    queryParams: { cacheKey: 'profile' },
    feedState: {},
    videoIndex: undefined,
  };
});

test('passes the full list and starts at the tapped index', async () => {
  mockRouteParams.videoIndex = 2;

  const props = await render();

  // The whole list, not flatPages.slice(2) — videos 0 and 1 must remain
  // reachable by scrolling up.
  expect(props.videos).toHaveLength(mockFlatPages.length);
  expect(props.videos[0].id).toBe('v0');
  expect(props.initialVideoIndex).toBe(2);
});

test('opens at the top when no index was given', async () => {
  mockRouteParams.videoIndex = undefined;

  const props = await render();

  expect(props.videos).toHaveLength(mockFlatPages.length);
  expect(props.initialVideoIndex).toBe(0);
});

test('keeps index 0 addressable rather than treating it as absent', async () => {
  mockRouteParams.videoIndex = 0;

  const props = await render();

  expect(props.videos).toHaveLength(mockFlatPages.length);
  expect(props.initialVideoIndex).toBe(0);
});

test('does not drop videos when the last tile is tapped', async () => {
  mockRouteParams.videoIndex = mockFlatPages.length - 1;

  const props = await render();

  expect(props.videos).toHaveLength(mockFlatPages.length);
  expect(props.initialVideoIndex).toBe(mockFlatPages.length - 1);
});

test('preserves the shared cache instead of truncating it to page 1', async () => {
  mockRouteParams.videoIndex = 3;

  await render();

  // The modal shares the grid's cacheKey; truncating the shared cache on mount
  // would evict the page holding the tapped video. It must opt out.
  const params = mockUseVideosInfiniteQuery.mock.calls[0][0] as any;
  expect(params.refetchFirstPageOnMount).toBe(false);
});

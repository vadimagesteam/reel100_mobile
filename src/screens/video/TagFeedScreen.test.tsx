/**
 * The hashtag page reads the video-feed store — through the grid, and through
 * the cache-key hook it calls directly — so it has to sit under a
 * VideoFeedProvider. It shipped without one and crashed on open with
 * "useVideoFeed must be used within VideoFeedProvider".
 *
 * The grid is stubbed here and the crash still reproduces without the provider,
 * because the cache-key hook alone is enough to need it.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Both are pulled in transitively by the api client and are not transformed
// by jest's react-native preset.
jest.mock('react-native-config', () => ({ APP_API_URL: 'http://test' }));
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../../navigation', () => ({
  useRoute: () => ({ params: { tags: ['oregon', 'fishing'], title: '#oregon + #fishing' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));
jest.mock('../../components/appHeader', () => ({ HeaderBackArrowButton: () => null }));
jest.mock('../../components/search/TagShareButton', () => ({ TagShareButton: () => null }));
jest.mock('../../components/videoTiles', () => ({ VideoTiles: () => null }));
jest.mock('../../components/search/hooks', () => ({
  useTagVideosHeaderQuery: () => ({
    data: {
      tags: [
        { id: 't1', name: 'oregon', label: 'Oregon' },
        { id: 't2', name: 'fishing', label: 'Fishing' },
      ],
      total: 2480,
    },
  }),
}));
jest.mock('../../components/videoFeed/hooks', () => {
  const actual = jest.requireActual('../../components/videoFeed/hooks');
  return {
    ...actual,
    // Real useSetVideoFeedCacheKey: it is what needs the provider.
    useVideosInfiniteQuery: () => ({
      flatPages: [],
      isLoading: false,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
      queryParams: {},
    }),
  };
});

import { TagFeedScreen } from './TagFeedScreen';

describe('TagFeedScreen', () => {
  it('renders without a missing-provider crash', () => {
    expect(() => {
      ReactTestRenderer.act(() => {
        ReactTestRenderer.create(<TagFeedScreen />);
      });
    }).not.toThrow();
  });

  it('titles the page with every tag it was opened for', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<TagFeedScreen />);
    });
    const { Text } = require('react-native');
    const shown = tree!.root
      .findAllByType(Text)
      .flatMap((n: any) => (Array.isArray(n.props.children) ? n.props.children : [n.props.children]))
      .filter((c: any) => typeof c === 'string')
      .join(' ');
    expect(shown).toContain('#oregon + #fishing');
    expect(shown).toContain('2.5k');
  });
});

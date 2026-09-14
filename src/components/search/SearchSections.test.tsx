/**
 * The results screen renders one card per populated section, and only offers
 * "View all" where the backend said more sits behind it.
 */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();
jest.mock('../../navigation', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));
jest.mock('./hooks/useOpenStatePage', () => ({ useOpenStatePage: () => jest.fn() }));
jest.mock('@react-native-vector-icons/ionicons', () => 'Ionicons');
jest.mock('./StateAvatar', () => ({ StateAvatar: () => null }));
jest.mock('../ui', () => ({
  Avatar: () => null,
  FlexLoading: () => null,
  ListEmptyBlock: ({ title }: any) => {
    const { Text: T } = require('react-native');
    const r = require('react');
    return r.createElement(T, null, title);
  },
}));

import { SearchSections } from './SearchSections';
import { SearchSectionsResponse } from './types';

const empty = { items: [], hasMore: false };

const creator = {
  type: 'user' as const,
  id: 'u1',
  username: 'oregonangler',
  name: 'Oregon Angler',
  firstName: null,
  lastName: null,
  nickname: null,
  avatar: null,
  totalUploads: 42,
  totalLikes: 1200,
};

const hashtag = {
  type: 'tag' as const,
  id: 'oregon+fishing',
  name: 'oregon+fishing',
  label: 'Oregon + Fishing',
  tags: [
    { id: 't1', name: 'oregon', label: 'Oregon' },
    { id: 't2', name: 'fishing', label: 'Fishing' },
  ],
  videosCount: 2480,
};

const build = (over: Partial<SearchSectionsResponse> = {}): SearchSectionsResponse => ({
  creators: empty,
  states: empty,
  hashtags: empty,
  videos: empty,
  ...over,
} as SearchSectionsResponse);

const render = (data?: SearchSectionsResponse) => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <SearchSections data={data} searchQuery="Oregon fishing" />,
    );
  });
  return tree!.root;
};

const texts = (root: ReactTestRenderer.ReactTestInstance) =>
  root.findAllByType(Text).flatMap((n) => (Array.isArray(n.props.children)
    ? n.props.children
    : [n.props.children])).filter((c) => typeof c === 'string');

describe('SearchSections', () => {
  beforeEach(() => mockNavigate.mockReset());

  it('shows only the sections that matched', () => {
    const root = render(build({ creators: { items: [creator], hasMore: false } }));
    const all = texts(root).join(' ');
    expect(all).toContain('Creators');
    // Four headers over three empty boxes reads as a broken screen.
    expect(all).not.toContain('States');
    expect(all).not.toContain('Hashtags');
  });

  it('offers View all only where more sits behind it', () => {
    const withMore = render(build({ creators: { items: [creator], hasMore: true } }));
    expect(texts(withMore).join(' ')).toContain('View all');

    const complete = render(build({ creators: { items: [creator], hasMore: false } }));
    expect(texts(complete).join(' ')).not.toContain('View all');
  });

  it('writes a combination row as its joined tags', () => {
    const root = render(build({ hashtags: { items: [hashtag], hasMore: false } }));
    const all = texts(root).join(' ');
    expect(all).toContain('#oregon + #fishing');
    // formatNumberShort is the app-wide convention ("2.5k"); the mock's "2.4K"
    // differs only in case, and matching the app beats matching the mock.
    expect(all).toContain('2.5k');
  });

  it('opens the hashtag page with every tag of a combination', () => {
    const root = render(build({ hashtags: { items: [hashtag], hasMore: false } }));
    ReactTestRenderer.act(() => {
      root.findAllByType(TouchableOpacity)[0].props.onPress();
    });
    // Both halves, or the intersection is lost on the way in.
    expect(mockNavigate).toHaveBeenCalledWith('TagFeed', {
      tags: ['oregon', 'fishing'],
      title: '#oregon + #fishing',
    });
  });

  it('says so when nothing matched at all', () => {
    const root = render(build());
    expect(texts(root).join(' ')).toContain('No Results');
  });
});

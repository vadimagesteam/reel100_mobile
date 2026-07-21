/**
 * The combined search list renders video results alongside users/states, opens
 * the video on tap, and its tags are tappable to re-run the search.
 */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();

jest.mock('../../navigation', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));
jest.mock('./hooks/useOpenStatePage', () => ({ useOpenStatePage: () => jest.fn() }));
// Stub children that pull native modules / reanimated.
jest.mock('@react-native-vector-icons/ionicons', () => 'Ionicons');
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  const r = require('react');
  const FlashList = ({ data, renderItem, ListEmptyComponent }: any) =>
    r.createElement(
      View,
      null,
      data && data.length
        ? data.map((item: any, index: number) =>
            r.createElement(View, { key: index }, renderItem({ item })),
          )
        : ListEmptyComponent,
    );
  return { FlashList };
});
jest.mock('../ui', () => ({
  Avatar: () => null,
  FlexLoading: () => null,
  ListEmptyBlock: () => null,
}));
jest.mock('./SearchStats', () => ({ StatPill: () => null, StateStatLine: () => null }));
jest.mock('./StateAvatar', () => ({ StateAvatar: () => null }));

const { CombinedSearchList } = require('./CombinedSearchList');

const videoResult = {
  type: 'video',
  id: 'v1',
  label: 'Big air',
  description: null,
  slug: 'big-air',
  likesCount: 4,
  tags: ['skate', 'park'],
  user: { id: 'u1', name: 'Ada', avatar: null },
};

const render = (props: Record<string, unknown>) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(React.createElement(CombinedSearchList, props));
  });
  return tree;
};

beforeEach(() => mockNavigate.mockClear());

const flatText = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(Text)
    .map((n) => (Array.isArray(n.props.children) ? n.props.children.join('') : n.props.children));

test('renders a video result with its title and tags', () => {
  const tree = render({ data: [videoResult] });
  const texts = flatText(tree);
  expect(texts).toContain('Big air');
  expect(texts).toContain('#skate');
  expect(texts).toContain('#park');
});

test('opens the video on row tap', () => {
  const tree = render({ data: [videoResult] });
  // The first TouchableOpacity is the video row.
  const row = tree.root.findAllByType(TouchableOpacity)[0];
  ReactTestRenderer.act(() => row.props.onPress());
  expect(mockNavigate).toHaveBeenCalledWith('VideoModal', { videoId: 'v1' });
});

test('tapping a tag re-runs the search for that tag', () => {
  const onTagPress = jest.fn();
  const tree = render({ data: [videoResult], onTagPress });
  // The tag chip is the innermost touchable: exactly one Text child, "#skate".
  const tagChip = tree.root.findAllByType(TouchableOpacity).find((t) => {
    const texts = t.findAllByType(Text);
    return (
      texts.length === 1 &&
      (Array.isArray(texts[0].props.children) ? texts[0].props.children.join('') : '') === '#skate'
    );
  });
  ReactTestRenderer.act(() => tagChip!.props.onPress());
  expect(onTagPress).toHaveBeenCalledWith('skate');
});

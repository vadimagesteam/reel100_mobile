/**
 * Verifies the scroll-reset fix: when the sort tab changes, StateRankingList
 * snaps its FlashList back to the top so the user sees the newly-ranked states
 * instead of staying scrolled mid-list.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StateRankingList } from './StateRankingList';
import { StateRankingItem } from './types';

// Capture mockScrollToOffset calls from whatever ref StateRankingList attaches.
const mockScrollToOffset = jest.fn();

jest.mock('@shopify/flash-list', () => {
  // Required inside the hoisted factory; aliased to avoid shadowing the import.
  const r = require('react');
  const FlashList = r.forwardRef((_props: any, ref: any) => {
    r.useImperativeHandle(ref, () => ({ scrollToOffset: mockScrollToOffset }));
    return null;
  });
  return { FlashList };
});

// Isolate the unit: stub out child/icon imports that pull native modules.
jest.mock('@react-native-vector-icons/ionicons', () => () => null);
jest.mock('../../theme', () => ({ colors: { muted: '#000' } }));
jest.mock('../ui', () => ({ FlexLoading: () => null, ListEmptyBlock: () => null }));
jest.mock('./SearchStats', () => ({ StateStatLine: () => null }));
jest.mock('./StateAvatar', () => ({ StateAvatar: () => null }));

const DATA: StateRankingItem[] = [
  { id: '1', label: 'Texas', slug: 'tx', uploadsToday: 9, totalUploads: 0,
    totalLikes: 0,
    uploadsLast7Days: 40 },
  { id: '2', label: 'Alabama', slug: 'al', uploadsToday: 0, totalUploads: 0,
    totalLikes: 0,
    uploadsLast7Days: 1 },
];

const render = (sort: 'most_active' | 'alphabetical') =>
  React.createElement(StateRankingList, { data: DATA, sort, onPress: jest.fn() });

test('scrolls back to top when the sort tab changes', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render('most_active'));
  });

  // Initial mount runs the effect once; ignore it and watch the tab switch.
  mockScrollToOffset.mockClear();

  await ReactTestRenderer.act(() => {
    tree.update(render('alphabetical'));
  });

  expect(mockScrollToOffset).toHaveBeenCalledTimes(1);
  expect(mockScrollToOffset).toHaveBeenCalledWith({ offset: 0, animated: false });
});

test('does not scroll when sort is unchanged (e.g. a re-render)', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render('most_active'));
  });
  mockScrollToOffset.mockClear();

  await ReactTestRenderer.act(() => {
    tree.update(render('most_active'));
  });

  expect(mockScrollToOffset).not.toHaveBeenCalled();
});

/**
 * Guards the "taps stop registering app-wide until restart" bug.
 *
 * The drawer scrim is a full-screen Pressable layered over the entire app. It
 * previously stayed mounted at all times, relying on
 * `pointerEvents={menuOpened ? 'auto' : 'none'}` to stay out of the way — while
 * its opacity was driven from a Reanimated shared value on the UI thread. The
 * two could disagree, leaving an invisible layer that swallowed every tap in
 * the app until a restart. That shipped once already (commit bf02bcd) and
 * regressed.
 *
 * These tests assert the structural property that makes it impossible: when the
 * menu is closed, the scrim is not in the tree at all.
 */
import React from 'react';
import { Pressable } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

const mockSetMenuOpened = jest.fn();
let mockMenuOpened = false;

jest.mock('../../state/app/uiStore', () => ({
  useUiStore: () => ({ menuOpened: mockMenuOpened, actions: { setMenuOpened: mockSetMenuOpened } }),
}));

jest.mock('../../state/user/authStore', () => ({
  useIsAuthenticated: () => true,
}));

jest.mock('./MenuContent', () => ({ MenuContent: () => null }));

jest.mock('react-native-gesture-handler', () => {
  const chainable: any = new Proxy(() => undefined, {
    get: () => () => chainable,
    apply: () => chainable,
  });
  return {
    Gesture: { Pan: () => chainable },
    GestureDetector: ({ children }: any) => children,
  };
});

jest.mock('react-native-reanimated', () => {
  const r = require('react');
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: (c: any) => c,
      View: ({ children }: any) => r.createElement('View', null, children),
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withTiming: (v: any) => v,
    withSpring: (v: any) => v,
    interpolate: () => 0,
    runOnJS: (fn: any) => fn,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

// Imported after the mocks so the component picks them up.
const { DrawerMenuWrapper } = require('./DrawerMenuWrapper');

const DRAWER_ANIMATION_MS = 200;

/** The scrim is the only Pressable carrying the dimming background class. */
const findScrim = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(Pressable)
    .filter((n) => String(n.props.className ?? '').includes('bg-black/80'));

const renderWrapper = async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(React.createElement(DrawerMenuWrapper, null, null));
  });
  return tree;
};

beforeEach(() => {
  jest.useFakeTimers();
  mockMenuOpened = false;
  mockSetMenuOpened.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

test('does not mount the scrim while the menu is closed', async () => {
  const tree = await renderWrapper();

  expect(findScrim(tree)).toHaveLength(0);
});

test('mounts the scrim while the menu is open', async () => {
  mockMenuOpened = true;
  const tree = await renderWrapper();

  expect(findScrim(tree)).toHaveLength(1);
});

test('unmounts the scrim after the close animation completes', async () => {
  mockMenuOpened = true;
  const tree = await renderWrapper();
  expect(findScrim(tree)).toHaveLength(1);

  // Close the menu and re-render, as the store update would.
  mockMenuOpened = false;
  await ReactTestRenderer.act(() => {
    tree.update(React.createElement(DrawerMenuWrapper, null, null));
  });

  // Still present during the fade — removing it instantly would pop the scrim.
  expect(findScrim(tree)).toHaveLength(1);

  await ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(DRAWER_ANIMATION_MS);
  });

  expect(findScrim(tree)).toHaveLength(0);
});

test('tapping the scrim closes the menu through the store, not a shared value', async () => {
  mockMenuOpened = true;
  const tree = await renderWrapper();

  await ReactTestRenderer.act(() => {
    findScrim(tree)[0].props.onPress();
  });

  // The store is the single source of truth; the old implementation mutated a
  // shared value and depended on a UI-thread round trip to get back here.
  expect(mockSetMenuOpened).toHaveBeenCalledWith(false);
});

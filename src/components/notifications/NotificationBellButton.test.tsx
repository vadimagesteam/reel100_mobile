/**
 * The header bell shows an unread dot only when there are unread notifications,
 * and opens the notification center on press.
 */
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();
let mockUnread = 0;

jest.mock('../../navigation', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('./hooks/useNotificationsApi', () => ({
  useUnreadNotificationsCount: () => ({ data: mockUnread }),
}));

const { NotificationBellButton } = require('./NotificationBellButton');

const render = () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(React.createElement(NotificationBellButton));
  });
  return tree;
};

// The badge dot is the only View with a rounded-full bg-primary className.
const dots = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(View)
    .filter((n) => String(n.props.className ?? '').includes('rounded-full'));

beforeEach(() => {
  mockNavigate.mockClear();
  mockUnread = 0;
});

test('hides the dot when there are no unread notifications', () => {
  expect(dots(render())).toHaveLength(0);
});

test('shows the dot when there are unread notifications', () => {
  mockUnread = 3;
  expect(dots(render())).toHaveLength(1);
});

test('opens the notification center on press', () => {
  const tree = render();
  ReactTestRenderer.act(() => {
    tree.root.findByType(TouchableOpacity).props.onPress();
  });
  expect(mockNavigate).toHaveBeenCalledWith('Notifications');
});

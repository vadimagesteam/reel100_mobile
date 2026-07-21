/**
 * In-app notification taps map to the shared router with the right payload, and
 * degrade gracefully (no navigation) when the row lacks the ids it needs.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockRoute = jest.fn();

jest.mock('../../../hooks/pushNotifications/routeNotification', () => ({
  routeNotification: (...a: unknown[]) => mockRoute(...a),
}));

const { useNotificationPress } = require('./useNotificationPress');
const { MessageType } = require('../../../hooks/pushNotifications/notificationDataType');

const press = (item: any) => {
  let handler!: (i: any) => void;
  function Harness() {
    handler = useNotificationPress();
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(React.createElement(Harness));
  });
  ReactTestRenderer.act(() => handler(item));
};

const base = { id: 'n1', read: false, readAt: null, createdAt: 'x' };

beforeEach(() => mockRoute.mockClear());

test('a comment-like tap routes to the comment', () => {
  press({
    ...base,
    type: 'CommentLike',
    actor: { id: 'a1' },
    payload: { videoId: 'v1', commentId: 'c1' },
  });
  expect(mockRoute).toHaveBeenCalledWith({
    type: MessageType.CommentLike,
    videoId: 'v1',
    commentId: 'c1',
  });
});

test('a follow tap routes to the actor profile', () => {
  press({ ...base, type: 'Follow', actor: { id: 'a1' }, payload: null });
  expect(mockRoute).toHaveBeenCalledWith({ type: MessageType.Follow, userId: 'a1' });
});

test('a message tap uses the chat id and the actor', () => {
  press({ ...base, type: 'Message', actor: { id: 'a1' }, payload: { chatId: 'ch1' } });
  expect(mockRoute).toHaveBeenCalledWith({
    type: MessageType.Chat,
    chatId: 'ch1',
    userId: 'a1',
  });
});

test('top100 carries the position as a string', () => {
  press({ ...base, type: 'Top100', actor: null, payload: { videoId: 'v1', position: 5 } });
  expect(mockRoute).toHaveBeenCalledWith({
    type: MessageType.Top100,
    videoId: 'v1',
    position: '5',
  });
});

test('a row missing its ids does not navigate', () => {
  press({ ...base, type: 'Comment', actor: { id: 'a1' }, payload: { videoId: 'v1' } });
  expect(mockRoute).not.toHaveBeenCalled();
});

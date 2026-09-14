/**
 * The notification mutations must keep the unread badge and the list cache in
 * sync optimistically, so the header dot and the screen never disagree.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockPatch = jest.fn();
const mockDelete = jest.fn();

jest.mock('../../../lib/api', () => ({
  api: {
    patch: (...a: unknown[]) => mockPatch(...a),
    delete: (...a: unknown[]) => mockDelete(...a),
  },
}));

const {
  useNotificationMutations,
  notificationsListKey,
  notificationsUnreadKey,
} = require('./useNotificationsApi');

const row = (id: string, read: boolean) => ({
  id,
  type: 'Follow',
  payload: null,
  read,
  readAt: null,
  createdAt: '2026-07-21T00:00:00.000Z',
  actor: null,
});

function renderMutations(client: QueryClient) {
  const ref: { current: ReturnType<typeof useNotificationMutations> } = {
    current: undefined as any,
  };
  function Harness() {
    ref.current = useNotificationMutations();
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
  await ReactTestRenderer.act(async () => {
    await jest.advanceTimersByTimeAsync(50);
  });
};

let client: QueryClient;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockPatch.mockResolvedValue({ data: {} });
  mockDelete.mockResolvedValue({ data: {} });
  client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  client.setQueryData(notificationsListKey, {
    pages: [[row('a', false), row('b', false), row('c', true)]],
    pageParams: [0],
  });
  client.setQueryData(notificationsUnreadKey, 2);
});

afterEach(() => {
  client.clear();
  jest.useRealTimers();
});

const flat = () =>
  (client.getQueryData(notificationsListKey) as any).pages.flat() as ReturnType<typeof row>[];

test('markRead flips the row and decrements the badge', async () => {
  const m = renderMutations(client);
  ReactTestRenderer.act(() => {
    m.current.markRead.mutate('a');
  });
  await flush();

  expect(flat().find((n) => n.id === 'a')!.read).toBe(true);
  expect(client.getQueryData(notificationsUnreadKey)).toBe(1);
});

test('markAllRead clears the badge and flips every row', async () => {
  const m = renderMutations(client);
  ReactTestRenderer.act(() => {
    m.current.markAllRead.mutate();
  });
  await flush();

  expect(flat().every((n) => n.read)).toBe(true);
  expect(client.getQueryData(notificationsUnreadKey)).toBe(0);
});

test('deleting an unread row removes it and decrements the badge', async () => {
  const m = renderMutations(client);
  ReactTestRenderer.act(() => {
    m.current.remove.mutate('a');
  });
  await flush();

  expect(flat().find((n) => n.id === 'a')).toBeUndefined();
  expect(client.getQueryData(notificationsUnreadKey)).toBe(1);
});

test('deleting an already-read row does not change the badge', async () => {
  const m = renderMutations(client);
  ReactTestRenderer.act(() => {
    m.current.remove.mutate('c');
  });
  await flush();

  expect(flat().find((n) => n.id === 'c')).toBeUndefined();
  expect(client.getQueryData(notificationsUnreadKey)).toBe(2);
});

test('clearAll empties the list and zeroes the badge', async () => {
  const m = renderMutations(client);
  ReactTestRenderer.act(() => {
    m.current.clearAll.mutate();
  });
  await flush();

  expect(flat()).toHaveLength(0);
  expect(client.getQueryData(notificationsUnreadKey)).toBe(0);
});

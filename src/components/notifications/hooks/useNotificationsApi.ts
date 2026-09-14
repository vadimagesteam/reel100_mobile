import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AppState } from 'react-native';
import { useEffect } from 'react';
import { api } from '../../../lib/api';
import { NotificationItem } from '../types';

const PAGE_SIZE = 30;

export const notificationsListKey = ['notifications', 'list'];
export const notificationsUnreadKey = ['notifications', 'unread'];

/**
 * Unread count for the bell badge. Kept cheap on the server (a counted index),
 * and refreshed when the app returns to the foreground so a notification that
 * arrived while backgrounded shows up without opening the list.
 */
export const useUnreadNotificationsCount = () => {
  const query = useQuery({
    queryKey: notificationsUnreadKey,
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/api/notifications/unread-count');
      return data.count;
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { refetch } = query;
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refetch();
      }
    });
    return () => sub.remove();
  }, [refetch]);

  return query;
};

/** Paginated notifications list, newest first. */
export const useNotificationsInfiniteQuery = () => {
  const hook = useInfiniteQuery({
    queryKey: notificationsListKey,
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await api.get<NotificationItem[]>('/api/notifications', {
        params: { take: PAGE_SIZE, skip: pageParam },
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.flat().length : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return { ...hook, flat: hook.data?.pages.flat() ?? [] };
};

/**
 * Mutations for the notification center. Each keeps the unread count and the
 * list in sync so the bell badge and screen never disagree.
 */
export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: notificationsUnreadKey });
    queryClient.invalidateQueries({ queryKey: notificationsListKey });
  };

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/notifications/${id}/read`);
    },
    onMutate: async (id: string) => {
      // Optimistically flip the row and decrement the badge.
      patchListRow(queryClient, id, (n) => ({ ...n, read: true }));
      bumpUnread(queryClient, -1);
    },
    onSettled: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await api.patch('/api/notifications/read-all');
    },
    onMutate: async () => {
      patchAllListRows(queryClient, (n) => ({ ...n, read: true }));
      queryClient.setQueryData(notificationsUnreadKey, 0);
    },
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/notifications/${id}`);
    },
    onMutate: async (id: string) => {
      const removed = removeListRow(queryClient, id);
      if (removed && !removed.read) {
        bumpUnread(queryClient, -1);
      }
    },
    onSettled: invalidate,
  });

  const clearAll = useMutation({
    mutationFn: async () => {
      await api.delete('/api/notifications/clear-all');
    },
    onMutate: async () => {
      queryClient.setQueryData(notificationsListKey, {
        pages: [[]],
        pageParams: [0],
      });
      queryClient.setQueryData(notificationsUnreadKey, 0);
    },
    onSettled: invalidate,
  });

  return { markRead, markAllRead, remove, clearAll };
};

type ListCache = { pages: NotificationItem[][]; pageParams: unknown[] };

const patchListRow = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  fn: (n: NotificationItem) => NotificationItem,
) => {
  queryClient.setQueryData<ListCache>(notificationsListKey, (data) => {
    if (!data?.pages) {return data;}
    return {
      ...data,
      pages: data.pages.map((page) => page.map((n) => (n.id === id ? fn(n) : n))),
    };
  });
};

const patchAllListRows = (
  queryClient: ReturnType<typeof useQueryClient>,
  fn: (n: NotificationItem) => NotificationItem,
) => {
  queryClient.setQueryData<ListCache>(notificationsListKey, (data) => {
    if (!data?.pages) {return data;}
    return { ...data, pages: data.pages.map((page) => page.map(fn)) };
  });
};

const removeListRow = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
): NotificationItem | undefined => {
  let removed: NotificationItem | undefined;
  queryClient.setQueryData<ListCache>(notificationsListKey, (data) => {
    if (!data?.pages) {return data;}
    return {
      ...data,
      pages: data.pages.map((page) =>
        page.filter((n) => {
          if (n.id === id) {
            removed = n;
            return false;
          }
          return true;
        }),
      ),
    };
  });
  return removed;
};

const bumpUnread = (queryClient: ReturnType<typeof useQueryClient>, delta: number) => {
  queryClient.setQueryData<number>(notificationsUnreadKey, (c) =>
    Math.max(0, (c ?? 0) + delta),
  );
};

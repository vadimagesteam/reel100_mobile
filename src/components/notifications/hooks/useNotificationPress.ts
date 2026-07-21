import { useCallback } from 'react';
import { NotificationItem } from '../types';

/**
 * Handles a tap on a notification row. Marking-read is done by the caller; this
 * hook owns the navigation to the notification's target.
 *
 * Deep-link routing is wired in the tap-to-deep-link task; for now it is a
 * no-op so the screen is usable (list, read, swipe-delete, clear all) without
 * navigating anywhere yet.
 */
export const useNotificationPress = () => {
  return useCallback((_item: NotificationItem) => {
    // Deep-link routing added in the follow-on task.
  }, []);
};

import { Platform } from 'react-native';

export interface AdDebugEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

const MAX_ENTRIES = 100;
const entries: AdDebugEntry[] = [];
const listeners: Set<() => void> = new Set();

const now = () => new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 2 });

export const adDebugLog = {
  info(message: string) {
    entries.unshift({ timestamp: now(), level: 'info', message });
    if (entries.length > MAX_ENTRIES) {
      entries.length = MAX_ENTRIES;
    }
    listeners.forEach((fn) => fn());
  },
  warn(message: string) {
    entries.unshift({ timestamp: now(), level: 'warn', message });
    if (entries.length > MAX_ENTRIES) {
      entries.length = MAX_ENTRIES;
    }
    listeners.forEach((fn) => fn());
  },
  error(message: string) {
    entries.unshift({ timestamp: now(), level: 'error', message });
    if (entries.length > MAX_ENTRIES) {
      entries.length = MAX_ENTRIES;
    }
    listeners.forEach((fn) => fn());
  },
  getEntries(): readonly AdDebugEntry[] {
    return entries;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  getAdUnitInfo() {
    return {
      isDev: __DEV__,
      platform: Platform.OS,
    };
  },
};

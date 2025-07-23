import axios from 'axios';
import Config from 'react-native-config';
import { useAuthStore } from '../state/user/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { clearStoreCaches } from './createPersistStore';

export const api = axios.create({
  baseURL: Config.APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'ReelApp',
    'x-Client-Version': '0.1', // todo: client version?
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('👹[Api Error]', {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      message: error?.message,
      data: error?.response?.data,
    });

    if (error?.response?.status === 401) {
      clearStoreCaches();
      useAuthStore.getState().actions.silentLogout();
    }

    // Sentry.captureException(error);
    return Promise.reject(error);
  },
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

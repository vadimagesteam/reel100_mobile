import { StoreApi } from 'zustand/vanilla';
import { VideoFeedStore } from './videoFeedStore.ts';
import { createContext } from 'react';

export const VideoFeedContext = createContext<StoreApi<VideoFeedStore> | undefined>(undefined);

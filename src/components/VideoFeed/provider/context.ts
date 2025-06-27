import { StoreApi } from 'zustand/vanilla';
import { PlayerStore } from './videoFeedStore.ts';
import { createContext } from 'react';

type VideoFeedStore = StoreApi<PlayerStore>;

export const VideoFeedContext = createContext<VideoFeedStore | undefined>(undefined);

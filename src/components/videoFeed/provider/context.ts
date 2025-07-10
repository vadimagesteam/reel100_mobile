import { StoreApi } from 'zustand/vanilla';
import { VideoFeedStore } from './videoFeedStore';
import { createContext } from 'react';

export const VideoFeedContext = createContext<StoreApi<VideoFeedStore> | undefined>(undefined);

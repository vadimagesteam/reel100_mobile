import { useVideoFeed } from './useVideoFeed';

export const useVideoFeedCacheKey = () => {
  const cacheKey = useVideoFeed((s) => s.cacheKey);
  if (!cacheKey) {
    // throw new Error('[VideoFeed] Cache key is required to set together with video loading');
  }
  // console.log(`READING CACHE_KEY: ${cacheKey}`);
  return cacheKey;
};

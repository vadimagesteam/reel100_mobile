import { CacheKey } from '../provider/videoFeedStore';
import { useVideoFeed } from './useVideoFeed';
import { useEffect } from 'react';

/**
 * Set video cache key
 * The key must be memoized for better perf
 */
export const useSetVideoFeedCacheKey = (cacheKey: CacheKey) => {
  const setCacheKey = useVideoFeed((s) => s.actions.setCacheKey);
  useEffect(() => {
    setCacheKey(cacheKey);
  }, [cacheKey, setCacheKey]);
};

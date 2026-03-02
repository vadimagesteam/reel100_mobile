import { useMemo, useRef } from 'react';
import type { NativeAd } from 'react-native-google-mobile-ads';
import type { VideoPost } from '../queries/apiVideosFetcher';
import { AD_INTERVAL, FeedItem } from './types';

export const useInterleaveAds = (
  videos: VideoPost[],
  consumeAd: () => NativeAd | null,
): FeedItem[] => {
  // Cache ads by their slot position so scrolling back shows the same ad
  const adCacheRef = useRef<Map<number, NativeAd | null>>(new Map());

  return useMemo(() => {
    const items: FeedItem[] = [];
    let adSlotIndex = 0;

    for (let i = 0; i < videos.length; i++) {
      items.push({
        type: 'video',
        data: videos[i],
        key: `video-${videos[i].id}`,
      });

      // Insert ad after every AD_INTERVAL videos
      if ((i + 1) % AD_INTERVAL === 0) {
        const cache = adCacheRef.current;

        if (!cache.has(adSlotIndex)) {
          cache.set(adSlotIndex, consumeAd());
        }

        items.push({
          type: 'ad',
          data: cache.get(adSlotIndex) ?? null,
          key: `ad-${adSlotIndex}`,
        });

        adSlotIndex++;
      }
    }

    return items;
  }, [videos, consumeAd]);
};

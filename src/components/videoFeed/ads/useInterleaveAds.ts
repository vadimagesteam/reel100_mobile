import { useMemo, useRef } from 'react';
import type { NativeAd } from 'react-native-google-mobile-ads';
import type { VideoPost } from '../queries/apiVideosFetcher';
import { AD_INTERVAL, FeedItem } from './types';

export const useInterleaveAds = (
  videos: VideoPost[],
  consumeAd: () => NativeAd | null,
  poolSize: number,
): FeedItem[] => {
  // Cache ads by their slot position so scrolling back shows the same ad
  const adCacheRef = useRef<Map<number, NativeAd>>(new Map());

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

        // Only cache non-null ads; retry on next render when pool refills
        if (!cache.has(adSlotIndex)) {
          const ad = consumeAd();
          if (ad) {
            cache.set(adSlotIndex, ad);
          }
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
    // poolSize triggers re-run when ads become available
  }, [videos, consumeAd, poolSize]);
};

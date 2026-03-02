import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeAd,
  NativeMediaAspectRatio,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const POOL_SIZE = 3;
const REFILL_THRESHOLD = 2;

const adUnitId = __DEV__
  ? TestIds.NATIVE
  : Platform.select({
      ios: 'ca-app-pub-2941838425354014/2959898965',
      android: 'ca-app-pub-2941838425354014/4603706016',
      default: TestIds.NATIVE,
    });

const loadNativeAd = (): Promise<NativeAd> =>
  NativeAd.createForAdRequest(adUnitId, {
    aspectRatio: NativeMediaAspectRatio.PORTRAIT,
    startVideoMuted: true,
  });

export const useNativeAdLoader = () => {
  const poolRef = useRef<NativeAd[]>([]);
  const mountedRef = useRef(true);
  const [poolSize, setPoolSize] = useState(0);

  const fillPool = useCallback(async () => {
    const needed = POOL_SIZE - poolRef.current.length;
    if (needed <= 0) {
      return;
    }

    const promises = Array.from({ length: needed }, () =>
      loadNativeAd().catch((err) => {
        console.log('[NativeAdLoader] Failed to load ad:', err);
        return null;
      }),
    );

    const results = await Promise.all(promises);

    if (!mountedRef.current) {
      results.forEach((ad) => ad?.destroy());
      return;
    }

    const loaded = results.filter((ad): ad is NativeAd => ad !== null);
    poolRef.current.push(...loaded);
    setPoolSize(poolRef.current.length);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fillPool();
    return () => {
      mountedRef.current = false;
      poolRef.current.forEach((ad) => ad.destroy());
      poolRef.current = [];
    };
  }, [fillPool]);

  const consumeAd = useCallback((): NativeAd | null => {
    const ad = poolRef.current.shift() ?? null;
    setPoolSize(poolRef.current.length);

    if (poolRef.current.length < REFILL_THRESHOLD) {
      fillPool();
    }

    return ad;
  }, [fillPool]);

  return { consumeAd, poolSize };
};

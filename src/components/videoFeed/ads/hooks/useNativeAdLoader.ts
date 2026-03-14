import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeAd,
  NativeMediaAspectRatio,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { adDebugLog } from '../adDebugLog';

const POOL_SIZE = 3;
const REFILL_THRESHOLD = 2;
const MAX_CONSECUTIVE_FAILURES = 3;
const BACKOFF_BASE_MS = 5_000;
const MAX_BACKOFF_MS = 60_000;

const adUnitId = __DEV__
  ? TestIds.NATIVE
  : Platform.select({
      ios: 'ca-app-pub-2941838425354014/7549059477',
      android: 'ca-app-pub-2941838425354014/9057911835',
      default: TestIds.NATIVE,
    });

let loadAttempt = 0;

const loadNativeAd = (): Promise<NativeAd> => {
  const attempt = ++loadAttempt;
  adDebugLog.info(`[Pool] Loading ad #${attempt} (unitId: ${adUnitId})`);
  return NativeAd.createForAdRequest(adUnitId, {
    aspectRatio: NativeMediaAspectRatio.PORTRAIT,
    startVideoMuted: true,
  });
};

export const useNativeAdLoader = () => {
  const poolRef = useRef<NativeAd[]>([]);
  const mountedRef = useRef(true);
  const [poolSize, setPoolSize] = useState(0);
  const consecutiveFailuresRef = useRef(0);
  const backoffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fillPool = useCallback(async () => {
    const needed = POOL_SIZE - poolRef.current.length;
    if (needed <= 0) {
      adDebugLog.info(`[Pool] Pool full (${poolRef.current.length}/${POOL_SIZE}), skip fill`);
      return;
    }

    // Stop retrying after repeated failures (format mismatch, missing config, etc.)
    if (consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
      const backoffMs = Math.min(
        BACKOFF_BASE_MS * Math.pow(2, consecutiveFailuresRef.current - MAX_CONSECUTIVE_FAILURES),
        MAX_BACKOFF_MS,
      );
      adDebugLog.warn(
        `[Pool] ${consecutiveFailuresRef.current} consecutive failures — backing off ${(backoffMs / 1000).toFixed(0)}s before retry`,
      );

      // Schedule a single retry after backoff
      if (!backoffTimerRef.current && mountedRef.current) {
        backoffTimerRef.current = setTimeout(() => {
          backoffTimerRef.current = null;
          if (mountedRef.current) {
            adDebugLog.info('[Pool] Backoff expired, retrying...');
            consecutiveFailuresRef.current = 0;
            fillPool();
          }
        }, backoffMs);
      }
      return;
    }

    adDebugLog.info(
      `[Pool] Filling pool: need ${needed} ads (current: ${poolRef.current.length}/${POOL_SIZE})`,
    );

    const promises = Array.from({ length: needed }, () =>
      loadNativeAd()
        .then((ad) => {
          adDebugLog.info(`[Pool] Ad loaded OK (headline: "${ad.headline}")`);
          return ad;
        })
        .catch((err) => {
          adDebugLog.error(`[Pool] Ad load FAILED: ${err?.code ?? ''} ${err?.message ?? err}`);
          return null;
        }),
    );

    const results = await Promise.all(promises);

    if (!mountedRef.current) {
      adDebugLog.warn('[Pool] Component unmounted during fill, destroying ads');
      results.forEach((ad) => ad?.destroy());
      return;
    }

    const loaded = results.filter((ad): ad is NativeAd => ad !== null);
    poolRef.current.push(...loaded);
    setPoolSize(poolRef.current.length);

    if (loaded.length === 0) {
      consecutiveFailuresRef.current += needed;
      adDebugLog.warn(
        `[Pool] Fill complete: 0/${needed} loaded (consecutive failures: ${consecutiveFailuresRef.current})`,
      );
    } else {
      consecutiveFailuresRef.current = 0;
      adDebugLog.info(
        `[Pool] Fill complete: ${loaded.length} loaded, pool now ${poolRef.current.length}/${POOL_SIZE}`,
      );
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    adDebugLog.info('[Pool] Hook mounted, starting initial fill');
    fillPool();
    return () => {
      mountedRef.current = false;
      if (backoffTimerRef.current) {
        clearTimeout(backoffTimerRef.current);
        backoffTimerRef.current = null;
      }
      adDebugLog.info(`[Pool] Hook unmounting, destroying ${poolRef.current.length} ads`);
      poolRef.current.forEach((ad) => ad.destroy());
      poolRef.current = [];
    };
  }, [fillPool]);

  const consumeAd = useCallback((): NativeAd | null => {
    const ad = poolRef.current.shift() ?? null;
    setPoolSize(poolRef.current.length);
    adDebugLog.info(
      `[Pool] Consumed ad: ${ad ? `"${ad.headline}"` : 'null (empty pool)'}, remaining: ${poolRef.current.length}`,
    );

    if (poolRef.current.length < REFILL_THRESHOLD) {
      adDebugLog.info(
        `[Pool] Below threshold (${poolRef.current.length} < ${REFILL_THRESHOLD}), triggering refill`,
      );
      fillPool();
    }

    return ad;
  }, [fillPool]);

  return { consumeAd, poolSize };
};

import { useCallback, useSyncExternalStore } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AD_INTERVAL } from '../../components/videoFeed/ads';
import { adDebugLog, AdDebugEntry } from '../../components/videoFeed/ads/adDebugLog';

const levelColors: Record<AdDebugEntry['level'], string> = {
  info: 'text-silver3',
  warn: 'text-yellow',
  error: 'text-red-400',
};

export const AdDebugScreen = () => {
  const insets = useSafeAreaInsets();

  const entries = useSyncExternalStore(
    adDebugLog.subscribe,
    adDebugLog.getEntries,
  );

  const adUnitInfo = adDebugLog.getAdUnitInfo();

  const renderEntry = useCallback((entry: AdDebugEntry, index: number) => {
    return (
      <View key={index} className="mb-1 flex-row">
        <Text className="mr-2 font-mono text-xs text-silver4">{entry.timestamp}</Text>
        <Text className={`flex-1 font-mono text-xs ${levelColors[entry.level]}`}>
          {entry.message}
        </Text>
      </View>
    );
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <View className="px-5 pt-6">
        <Text className="text-2xl font-bold text-primary">Advertisement Debug</Text>
        <Text className="text-md mb-6 text-muted">
          This debug menu is available for Nikola & Vadimages
        </Text>

        <View className="mb-4 rounded-xl bg-black5 p-4">
          <Text className="mb-4 text-lg font-semibold text-primary">Inline Native Ads</Text>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Ad Type:</Text>
            <Text className="text-lg font-bold text-primary">Native (Inline)</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Ad Interval:</Text>
            <Text className="text-lg font-bold text-primary">Every {AD_INTERVAL} videos</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Platform:</Text>
            <Text className="text-lg font-bold text-primary">{adUnitInfo.platform}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-primary">Mode:</Text>
            <View
              className={`rounded-full px-3 py-1 ${adUnitInfo.isDev ? 'bg-yellow-600' : 'bg-green-600'}`}
            >
              <Text className="font-medium text-white">
                {adUnitInfo.isDev ? 'Test Ads' : 'Production'}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-4 rounded-xl bg-black5 p-4">
          <Text className="mb-2 text-sm font-semibold text-primary">How it works:</Text>
          <Text className="mb-2 text-xs leading-5 text-primary">
            {'\u2022'} Native ads appear inline in the video feed as swipeable full-screen items
          </Text>
          <Text className="mb-2 text-xs leading-5 text-primary">
            {'\u2022'} An ad is placed after every {AD_INTERVAL} videos in the feed
          </Text>
          <Text className="mb-2 text-xs leading-5 text-primary">
            {'\u2022'} Ads are pre-loaded in a pool of 3 for smooth display
          </Text>
          <Text className="text-xs leading-5 text-primary">
            {'\u2022'} Double-tap to like is disabled on ad items
          </Text>
        </View>

        <View className="rounded-xl bg-black5 p-4">
          <Text className="mb-3 text-lg font-semibold text-primary">
            Live Debug Log ({entries.length} entries)
          </Text>
          {entries.length === 0 ? (
            <Text className="font-mono text-xs text-silver4">
              No log entries yet. Navigate to a video feed to trigger ad loading.
            </Text>
          ) : (
            entries.map(renderEntry)
          )}
        </View>
      </View>
    </ScrollView>
  );
};

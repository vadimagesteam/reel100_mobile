import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AD_INTERVAL } from '../../components/videoFeed/ads';

export const AdDebugScreen = () => {
  const insets = useSafeAreaInsets();

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

        <View className="mb-8 rounded-xl bg-black5 p-4">
          <Text className="mb-4 text-lg font-semibold text-primary">Inline Native Ads</Text>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Ad Type:</Text>
            <Text className="text-lg font-bold text-primary">Native (Inline)</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Ad Interval:</Text>
            <Text className="text-lg font-bold text-primary">Every {AD_INTERVAL} videos</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-primary">Mode:</Text>
            <View className="rounded-full bg-green-600 px-3 py-1">
              <Text className="font-medium text-white">{__DEV__ ? 'Test Ads' : 'Production'}</Text>
            </View>
          </View>
        </View>

        <View className="rounded-xl bg-black5 p-4">
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
      </View>
    </ScrollView>
  );
};

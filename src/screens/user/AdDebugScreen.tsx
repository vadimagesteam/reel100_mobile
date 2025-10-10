import clsx from 'clsx';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdState } from '../../components/videoFeed/ads';
import { Input } from '../../components/ui';

export const AdDebugScreen = () => {
  const insets = useSafeAreaInsets();
  const { adShowConfig, videosWatched, timeWatched, canPlayAd } = useAdState();

  const willShowAd = canPlayAd();

  const updateMinVideoMin = (value: string) => {
    const num = parseInt(value, 10) || 0;
    useAdState.setState({
      adShowConfig: {
        ...adShowConfig,
        minVideoWatched: [num, adShowConfig.minVideoWatched[1]],
      },
    });
  };

  const updateMinVideoMax = (value: string) => {
    const num = parseInt(value, 10) || 0;
    useAdState.setState({
      adShowConfig: {
        ...adShowConfig,
        minVideoWatched: [adShowConfig.minVideoWatched[0], num],
      },
    });
  };

  const updateMinSecondsWatched = (value: string) => {
    const num = parseInt(value, 10) || 0;
    useAdState.setState({
      adShowConfig: {
        ...adShowConfig,
        minSecondsWatched: num,
      },
    });
  };

  const handleReset = () => {
    useAdState.setState({
      adShowConfig: {
        minVideoWatched: [4, 5],
        minSecondsWatched: 250,
      },
    });
  };

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
          <Text className="mb-4 text-lg font-semibold text-primary">Current State</Text>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Will Show Ad:</Text>
            <View
              className={`rounded-full px-3 py-1 ${willShowAd ? 'bg-green-600' : 'bg-red-600'}`}
            >
              <Text className="font-medium text-white">{willShowAd ? 'Yes' : 'No'}</Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base text-primary">Videos Watched:</Text>
            <Text className="text-lg font-bold text-primary">{videosWatched}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-primary">Time Watched:</Text>
            <Text className="text-lg font-bold text-primary">{timeWatched}s</Text>
          </View>

          <Text className={clsx('mt-4 text-xs', willShowAd ? 'text-green1' : 'text-red1')}>
            {willShowAd
              ? 'Ad will be shown on the next full screen watch'
              : 'Ad conditions not met yet'}
          </Text>
        </View>

        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold text-primary">Configuration</Text>

          <View className="mb-4">
            <Text className="mb-2 text-base text-primary">Min Videos Watched (Range)</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Input
                  value={String(adShowConfig.minVideoWatched[0])}
                  onChangeText={updateMinVideoMin}
                  keyboardType="numeric"
                  placeholder="Min"
                  className="text-center"
                />
              </View>
              <Text className="text-primary">to</Text>
              <View className="flex-1">
                <Input
                  value={String(adShowConfig.minVideoWatched[1])}
                  onChangeText={updateMinVideoMax}
                  keyboardType="numeric"
                  placeholder="Max"
                  className="text-center"
                />
              </View>
            </View>
            <Text className="mt-1 text-xs text-silver6">
              Random number between these values will be selected
            </Text>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base text-primary">Min Seconds Watched</Text>
            <Input
              value={String(adShowConfig.minSecondsWatched)}
              onChangeText={updateMinSecondsWatched}
              keyboardType="numeric"
              placeholder="Seconds"
            />
            <Text className="mt-1 text-xs text-silver6">
              Ad will show when either condition is met first
            </Text>
          </View>

          <View className="mt-6 flex-col gap-3">
            <TouchableOpacity
              onPress={handleReset}
              className="rounded-xl border-2 border-silver6 py-3"
            >
              <Text className="text-center text-base font-semibold text-silver6">
                Reset to Default
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-xl bg-black5 p-4">
          <Text className="mb-2 text-sm font-semibold text-primary">How it works:</Text>
          <Text className="mb-2 text-xs leading-5 text-primary">
            • The app randomly picks a number between Min and Max videos watched
          </Text>
          <Text className="mb-2 text-xs leading-5 text-primary">
            • Ad shows when either videos watched OR seconds watched threshold is reached
          </Text>
          <Text className="text-xs leading-5 text-primary">
            • After an ad is shown, counters reset and the cycle starts again
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

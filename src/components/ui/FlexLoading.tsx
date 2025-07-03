import { ActivityIndicator, View } from 'react-native';

export const FlexLoading = () => (
  <View className="flex-1 grow items-center justify-center">
    <ActivityIndicator color="#fff" />
  </View>
);

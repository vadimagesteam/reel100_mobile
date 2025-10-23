import Ionicons from '@react-native-vector-icons/ionicons';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export const EmptyTop100Videos = ({ stateLabel }: { stateLabel: string }) => (
  <View className="flex-1 flex-col items-center justify-center gap-4">
    <Animated.View entering={FadeIn.delay(100)}>
      <Ionicons name="videocam" size={50} color="#9a9a9a" />
    </Animated.View>
    <Animated.Text
      entering={FadeIn.delay(200)}
      className="text-center text-xl font-semibold text-primary"
    >
      Rush the ranks {stateLabel}!
    </Animated.Text>
  </View>
);

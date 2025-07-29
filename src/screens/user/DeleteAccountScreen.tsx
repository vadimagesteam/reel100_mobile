import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../../components/ui';
import { useLoadingCallback } from '../../hooks/useLoadingCallback';
import { useAuthActions } from '../../state/user/authStore';

export const DeleteAccountScreen = () => {
  const navigation = useNavigation();
  const { deleteMyAccount } = useAuthActions();

  const [handleConfirm, isLoading] = useLoadingCallback(async () => {
    await deleteMyAccount();
    Alert.alert('Deletion completed', 'Your account has been successfully deleted.');
  });

  const rotationAnimation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4, // Run the animation 4 times
    );
    opacity.value = withTiming(1, { duration: 1000 });
  }, [opacity, rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-col justify-center gap-4 px-[10%]">
        <View className="flex-col items-center gap-4">
          <Animated.View style={animatedStyle}>
            <Ionicons name="sad-outline" size={150} color="#fff" />
          </Animated.View>

          <Text className="text-2xl font-bold text-primary">Sad to hear that</Text>
          <Text className="text-xl font-normal text-muted">
            Are you sure you want to delete your account? All related data will be deleted
            permanently. This action cannot be undone.
          </Text>
        </View>

        <Animated.View entering={FadeIn.duration(1000)} className="flex-col gap-4">
          <Button
            disabled={isLoading}
            loading={isLoading}
            onPress={handleConfirm}
            size="md"
            variant="danger"
          >
            Yes, delete it
          </Button>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            size="md"
            variant="outline"
          >
            No, go back
          </Button>
        </Animated.View>
      </View>
    </View>
  );
};

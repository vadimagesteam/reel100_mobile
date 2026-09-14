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
    try {
      await deleteMyAccount();
    } catch (error) {
      // The request used to fail for every real user (the server could not
      // remove the row) and nothing caught it: useLoadingCallback only clears
      // its spinner, so the screen just went quiet and the user tried again.
      // Whatever goes wrong now, say so.
      Alert.alert(
        'Deletion failed',
        'We could not delete your account. Please check your connection and try again, or contact support if it keeps happening.',
      );
      return;
    }
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
          {/*
            Wording matches what deletion actually does: the account is closed
            and can never be signed into again, but videos and comments already
            posted are not erased — other people's chats and comment threads
            depend on them. Claiming everything is wiped would be untrue.
          */}
          <Text className="text-xl font-normal text-muted">
            Are you sure you want to delete your account? You will be signed out and will not be
            able to sign in again. Videos and comments you have already posted may remain visible.
            This action cannot be undone.
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

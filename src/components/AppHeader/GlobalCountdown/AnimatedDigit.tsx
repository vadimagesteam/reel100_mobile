import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { View, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import themeColors from '../../../theme/themeColors';

export const AnimatedDigit = ({ digit }: { digit: string }) => {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [curDigit, setCurDigit] = useState(digit);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (digit !== curDigit) {
      setPrevDigit(curDigit);
      setCurDigit(digit);
      progress.value = 0;
      progress.value = withTiming(1, { duration: 250 });
    }
  }, [curDigit, digit, progress]);

  const prevStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -20]) }],
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
    position: 'absolute',
  }));

  const curStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [20, 0]) }],
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  return (
    <View>
      <Animated.Text style={[styles.digit, prevStyle]}>{prevDigit}</Animated.Text>
      <Animated.Text style={[styles.digit, curStyle]}>{curDigit}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  digit: {
    fontSize: 24,
    fontWeight: 900,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
    }),
    color: themeColors.blue2,
    textAlign: 'center',
  },
});

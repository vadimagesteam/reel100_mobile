import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { View, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface AnimatedDigitProps {
  char: string | number;
  className?: string;
}

export const AnimatedChar = ({ char, className }: AnimatedDigitProps) => {
  const [prevDigit, setPrevDigit] = useState(char);
  const [curDigit, setCurDigit] = useState(char);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (char !== curDigit) {
      setPrevDigit(curDigit);
      setCurDigit(char);
      progress.value = 0;
      progress.value = withTiming(1, { duration: 250 });
    }
  }, [curDigit, char, progress]);

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
      <Animated.Text
        className={clsx(
          'text-center font-extrabold text-primary',
          Platform.select({
            ios: 'font-[Courier] text-[24px]',
            android: 'font-[monospace] text-[20px]',
          }),
          className,
        )}
        style={prevStyle}
      >
        {prevDigit}
      </Animated.Text>
      <Animated.Text
        className={clsx(
          'text-center font-extrabold text-primary',
          Platform.select({
            ios: 'font-[Courier] text-[24px]',
            android: 'font-[monospace] text-[20px]',
          }),
          className,
        )}
        style={curStyle}
      >
        {curDigit}
      </Animated.Text>
    </View>
  );
};

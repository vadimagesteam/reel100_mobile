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
  char: string;
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
          'text-center text-[24px] font-extrabold text-blue2',
          Platform.select({
            ios: 'font-[Courier]',
            android: 'font-[monospace]',
          }),
          className,
        )}
        style={prevStyle}
      >
        {prevDigit}
      </Animated.Text>
      <Animated.Text
        className={clsx(
          'text-center text-[24px] font-extrabold text-blue2',
          Platform.select({
            ios: 'font-[Courier]',
            android: 'font-[monospace]',
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

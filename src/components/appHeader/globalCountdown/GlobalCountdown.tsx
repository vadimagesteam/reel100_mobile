import { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useCentralTimeCountdown } from './useCentralTimeCountdown.ts';
import { formatClockTime } from '../../../utils/formatTime.ts';
import { AnimatedChar } from '../../ui';

export const GlobalCountdown = (props: ViewProps) => {
  const { secondsLeft, start, cleanup } = useCentralTimeCountdown();
  useEffect(() => {
    start();
    return () => cleanup();
  }, [cleanup, start]);

  // No need to memoize, it updates every second
  const digits = formatClockTime(secondsLeft).split('');

  return (
    <Animated.View className="elevation-lg flex-row items-center justify-center py-4" {...props}>
      {digits.map((d, i) => (
        <AnimatedChar key={i} char={d} />
      ))}
    </Animated.View>
  );
};

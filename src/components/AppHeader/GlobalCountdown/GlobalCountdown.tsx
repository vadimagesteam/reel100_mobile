import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { useCentralTimeCountdown } from './useCentralTimeCountdown.ts';
import { formatClockTime } from '../../../utils/formatTime.ts';
import { AnimatedDigit } from './AnimatedDigit.tsx';
import { ViewProps } from 'react-native';

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
        <AnimatedDigit key={i} digit={d} />
      ))}
    </Animated.View>
  );
};

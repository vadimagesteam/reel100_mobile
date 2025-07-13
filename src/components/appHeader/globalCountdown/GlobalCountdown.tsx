import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useCentralTimeCountdown } from './useCentralTimeCountdown';
import { formatClockTime } from '../../../utils';
import { AnimatedChar } from '../../ui';

export const GlobalCountdown = (props: ViewProps) => {
  const { secondsLeft, start, cleanup } = useCentralTimeCountdown();
  useEffect(() => {
    start();
    return () => cleanup();
  }, [cleanup, start]);

  // stop timer when screen isn't focused
  useFocusEffect(
    useCallback(() => {
      start();
      return () => cleanup();
    }, [cleanup, start]),
  );

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

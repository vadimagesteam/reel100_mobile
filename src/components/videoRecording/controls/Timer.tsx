import clsx from 'clsx';
import { Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AnimatedChar } from '../../ui';

export interface TimerProps {
  maxDurationSeconds: number;
  active: boolean;
  onTimeOut: () => void;
}

export const Timer = ({ active, onTimeOut, maxDurationSeconds }: TimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(maxDurationSeconds);
  const timerRef = useRef<NodeJS.Timeout>(null);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacity.value = withTiming(1);
      let tickValue = maxDurationSeconds;
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
        tickValue--;
        if (tickValue <= 0) {
          clearInterval(timerRef.current!);
          onTimeOut();
        }
      }, 1000);
    } else {
      opacity.value = 0;
      setSecondsLeft(maxDurationSeconds);
      clearInterval(timerRef.current!);
    }
    return () => {
      clearInterval(timerRef.current!);
    };
  }, [active, onTimeOut, maxDurationSeconds, opacity]);

  const styles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // No need to memoize, it updates on every render
  const digits = `${secondsLeft.toString()}s`.split('');

  return (
    <Animated.View
      style={styles}
      className={clsx(
        'absolute top-[70px] flex-row items-center self-center overflow-hidden rounded-[10px] bg-red1 px-[20px]',
        Platform.select({
          ios: 'top-[50px]',
          android: 'top-[20px]',
        }),
      )}
    >
      {digits.map((d, i) => (
        <AnimatedChar key={i} char={d} className="py-2 text-[12px] font-light text-primary" />
      ))}
    </Animated.View>
  );
};
